package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.EmailTemplate;
import com.example.CampusUtsav.dtos.EventLogResponse;
import com.example.CampusUtsav.dtos.EventResponse;
import com.example.CampusUtsav.dtos.miniDtos.EventSummary;
import com.example.CampusUtsav.entity.*;
import com.example.CampusUtsav.entity.enums.EmailType;
import com.example.CampusUtsav.entity.enums.EventStatus;
import com.example.CampusUtsav.entity.enums.NotificationType;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.mapper.EventLogMapper;
import com.example.CampusUtsav.mapper.EventMapper;
import com.example.CampusUtsav.repository.*;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.EmailService;
import com.example.CampusUtsav.service.EventLogService;
import com.example.CampusUtsav.service.NotificationService;
import com.example.CampusUtsav.serviceImpl.helper.EntityLookupService;
import com.example.CampusUtsav.serviceImpl.helper.ValidationHelperService;
import com.example.CampusUtsav.utils.EmailUtils;
import com.example.CampusUtsav.utils.EventUtils;
import com.example.CampusUtsav.utils.NotificationUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@AllArgsConstructor
public class EventLogServiceImpl implements EventLogService {

    private final StaffRepository staffRepository;
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;
    private final EventLogMapper eventLogMapper;
    private final CollegeRepository collegeRepository;
    private final ClubRepository clubRepository;
    private final EventLogRepository eventLogRepository;
    private final NotificationService notificationService;
    private final NotificationUtils notificationUtils;
    private final EventUtils eventUtils;
    private final EntityLookupService entityLookupService;
    private final ValidationHelperService validationHelperService;
    private final EmailService emailService;
    private final EmailUtils emailUtils;


    @Override
    @Transactional(readOnly = true)
    public List<EventSummary> getAllPendingEventsByRole(Integer collegeId, Role userRole, CustomUserDetails currentUser) throws AccessDeniedException {

        String userEmail = currentUser.getUser().getEmail();
        List<Event> pendingEvents;

        switch(userRole) {
            case ROLE_FACULTY:
                Staff curFaculty = entityLookupService.getStaff(userEmail);

                // Security check: Only if they are actually a coordinator
                validationHelperService.validateIsClubCoordinator(curFaculty);

                pendingEvents = eventRepository.findAllByClub_Coordinator_EmailAndStatusAndPendingApprovalAt(
                        userEmail,
                        EventStatus.SUBMITTED,
                        Role.ROLE_FACULTY
                );
                break;

            case ROLE_HOD:
                Staff curStaff = entityLookupService.getStaff(userEmail);

                validationHelperService.validateIsHod(curStaff);

                if (curStaff.getBranch() == null) {
                    throw new RuntimeException("Error: No branch assigned to this HOD profile.");
                }

                pendingEvents = eventRepository.findAllByClub_Branch_IdAndStatusAndPendingApprovalAt(
                        curStaff.getBranch().getId(),
                        EventStatus.FACULTY1_APPROVED,
                        Role.ROLE_HOD
                );
                break;

            case ROLE_PRINCIPAL:
                // Principal = College Account, so we use collegeId directly
                pendingEvents = eventRepository.findAllByClub_College_IdAndStatusAndPendingApprovalAt(
                        collegeId,
                        EventStatus.HOD_APPROVED,
                        Role.ROLE_PRINCIPAL
                );
                break;

            default:
                return Collections.emptyList();
        }

        // Common mapping logic for all cases
        if (pendingEvents == null || pendingEvents.isEmpty()) {
            return Collections.emptyList();
        }

        return pendingEvents.stream()
                .map(eventMapper::convertToEventSummary)
                .toList();
    }

    @Override
    @Transactional
    public String approveEventByRole(Integer eventId, String remarks, CustomUserDetails currentUser) throws AccessDeniedException {
        Role userRole = currentUser.getUser().getRole();
        String userEmail = currentUser.getUser().getEmail();

        Event currentEvent = entityLookupService.getEvent(eventId);
        Club linkedClub = currentEvent.getClub();
        EventLog eventLog;
        EventLog existingLog = eventLogRepository.findFirstByEventOrderByIdDesc(currentEvent)
                .orElseThrow(()-> new RuntimeException("No previous logs found for current event!"));

        Role forwardedTo;
        EventStatus fromStatus;
        String message;

        switch(userRole){
            case ROLE_FACULTY:
                Staff curFaculty = entityLookupService.getStaff(userEmail);

                validationHelperService.validateIsClubCoordinator(curFaculty);

                validationHelperService.validateIsClubCoordinatorOfSpecifiedClub(curFaculty, linkedClub.getId());

                if(linkedClub.getBranch() == null)
                    forwardedTo = Role.ROLE_PRINCIPAL;
                else
                    forwardedTo = Role.ROLE_HOD;

                currentEvent.setStatus(EventStatus.FACULTY1_APPROVED);
                currentEvent.setPendingApprovalAt(forwardedTo);
                eventRepository.save(currentEvent);

                eventLog = eventLogMapper.toEventLogEntity(
                        EventStatus.APPROVED,
                        Role.ROLE_FACULTY,
                        forwardedTo,
                        EventStatus.SUBMITTED,
                        EventStatus.FACULTY1_APPROVED,
                        remarks.isBlank() ? "System Generated: All Ok." : remarks,
                        currentEvent,
                        existingLog.getVersion());

                eventLogRepository.save(eventLog);

                // =================================
                // NOTIFICATION TO CLUB ADMIN ABOUT FACULTY APPROVAL
                // =================================

                message = notificationUtils
                        .eventStatusChangeNotificationMessage(
                                EventStatus.FACULTY1_APPROVED,
                                currentEvent
                        );

                notificationService.createNotification(
                        linkedClub.getUser(),
                        "Event Approval Update",
                        message,
                        NotificationType.EVENT_STATUS_CHANGE,
                        "/club-dashboard/events/" + currentEvent.getId()
                );

                // =================================
                // NOTIFICATION TO HOD/PRINCIPAL ABOUT NEW EVENT PENDING FOR REVIEW
                // =================================

                EventUtils.ApproverInfo info = eventUtils.buildApproverInfo(forwardedTo, currentEvent, linkedClub, linkedClub.getCollege());
                User approverUser = info.approverUser();
                String approverMessage = info.approverMessage();

                Staff approverStaff = entityLookupService.getStaff(approverUser.getEmail());

                notificationService.createNotification(
                        approverUser,
                        "New Event Pending for Your Review",
                        approverMessage,
                        NotificationType.EVENT_STATUS_CHANGE,
                        approverUser.getRole() == Role.ROLE_HOD
                                ? "/staff-dashboard/inbox"
                                : "/college-dashboard/inbox"
                );

                // =================================
                // UPDATE EMAIL TO CLUBS ABOUT FACULTY APPROVAL
                // =================================
                EmailTemplate emailTemplate =
                        emailUtils.buildEventFacultyApprovedEmail(
                                currentEvent.getTitle(),
                                linkedClub.getName()
                        );

                emailService.sendEmail(
                        linkedClub.getAdminEmail(),
                        EmailType.EVENT_APPROVED,
                        emailTemplate
                );

                // =================================
                // EMAIL FOR HOD/PRINCIPAL ABOUT NEW EVENT PENDING FOR REVIEW
                // =================================

                emailService.sendEmail(
                        approverUser.getEmail(),
                        EmailType.ACTION_REQUIRED,
                        emailUtils.buildEventPendingApprovalEmail(
                                currentEvent.getTitle(),
                                approverStaff.getName(),
                                linkedClub.getName(),
                                "Faculty Coordinator"
                        )
                );

                if(forwardedTo == Role.ROLE_PRINCIPAL){
                    return "Event approved and successfully forwarded to the Principal for final authorization";
                }
                else return "Event approved and successfully forwarded to the Head of Department for further review.";

            case ROLE_HOD:
                Staff curHod = entityLookupService.getStaff(userEmail);

                validationHelperService.validateIsHod(curHod);

                validationHelperService.validateIsHodOfSpecifiedBranch(curHod, linkedClub.getBranch().getId());

                currentEvent.setStatus(EventStatus.HOD_APPROVED);
                currentEvent.setPendingApprovalAt(Role.ROLE_PRINCIPAL);
                eventRepository.save(currentEvent);

                eventLog = eventLogMapper.toEventLogEntity(
                        EventStatus.APPROVED,
                        Role.ROLE_HOD,
                        Role.ROLE_PRINCIPAL,
                        EventStatus.FACULTY1_APPROVED,
                        EventStatus.HOD_APPROVED,
                        remarks.isBlank() ? "System Generated: All Ok." : remarks,
                        currentEvent,
                        existingLog.getVersion());

                eventLogRepository.save(eventLog);

                // =================================
                // NOTIFICATION TO CLUB ADMIN ABOUT HOD APPROVAL
                // =================================

                message = notificationUtils
                        .eventStatusChangeNotificationMessage(
                                EventStatus.HOD_APPROVED,
                                currentEvent
                        );

                notificationService.createNotification(
                        linkedClub.getUser(),
                        "Event Approval Update",
                        message,
                        NotificationType.EVENT_STATUS_CHANGE,
                        "/club-dashboard/events/" + currentEvent.getId()
                );

                // =================================
                // NOTIFICATION TO PRINCIPAL ABOUT NEW EVENT PENDING FOR REVIEW
                // =================================

                info = eventUtils.buildApproverInfo(Role.ROLE_PRINCIPAL, currentEvent, linkedClub, linkedClub.getCollege());
                approverUser = info.approverUser();
                approverMessage = info.approverMessage();

                College approverPrincipal = entityLookupService.getCollege(approverUser.getEmail());

                notificationService.createNotification(
                        approverUser,
                        "New Event Pending for Your Review",
                        approverMessage,
                        NotificationType.EVENT_STATUS_CHANGE,
                        "/college-dashboard/inbox"
                );

                // =================================
                // UPDATE EMAIL TO CLUBS ABOUT HOD APPROVAL
                // =================================

                emailService.sendEmail(
                        linkedClub.getAdminEmail(),
                        EmailType.EVENT_APPROVED,
                        emailUtils.buildEventHodApprovedForClubEmail(
                                currentEvent.getTitle(),
                                linkedClub.getName(),
                                "Principal"
                        )
                );

                // =================================
                // EMAIL FOR PRINCIPAL ABOUT NEW EVENT PENDING FOR REVIEW
                // =================================

                emailService.sendEmail(
                        approverUser.getEmail(),
                        EmailType.ACTION_REQUIRED,
                        emailUtils.buildEventPendingPrincipalApprovalEmail(
                                currentEvent.getTitle(),
                                approverPrincipal.getName(),
                                linkedClub.getName(),
                                linkedClub.getCollege().getName(),
                                curHod.getName()
                        )
                );

                return "Departmental clearance granted. Forwarded to the Principal for final approval.";

            case ROLE_PRINCIPAL:
                College curPrincipal = entityLookupService.getCollege(userEmail);

                validationHelperService.validateClubBelongsToSpecifiedCollege(linkedClub, currentUser.getCollegeId());

                if(linkedClub.getBranch() == null)
                    fromStatus = EventStatus.FACULTY1_APPROVED;
                else
                    fromStatus = EventStatus.HOD_APPROVED;

                currentEvent.setStatus(EventStatus.APPROVED);
                currentEvent.setPendingApprovalAt(null);
                eventRepository.save(currentEvent);

                eventLog = eventLogMapper.toEventLogEntity(
                        EventStatus.APPROVED,
                        Role.ROLE_PRINCIPAL,
                        null,
                        fromStatus,
                        EventStatus.APPROVED,
                        remarks.isBlank() ? "System Generated: Event approved and published live." : remarks,
                        currentEvent,
                        existingLog.getVersion());

                eventLogRepository.save(eventLog);

                // =================================
                // NOTIFICATION TO CLUB ADMIN ABOUT FINAL APPROVAL
                // =================================

                message = notificationUtils
                        .eventStatusChangeNotificationMessage(
                                EventStatus.APPROVED,
                                currentEvent
                        );

                notificationService.createNotification(
                        linkedClub.getUser(),
                        "Event Approved and Published",
                        message,
                        NotificationType.EVENT_STATUS_CHANGE,
                        "/club-dashboard/events/" + currentEvent.getId()
                );

                // =================================
                // EMAIL TO CLUB ADMIN ABOUT FINAL APPROVAL
                // =================================

                emailService.sendEmail(
                        linkedClub.getAdminEmail(),
                        EmailType.EVENT_APPROVED,
                        emailUtils.buildEventFinalApprovalEmail(
                                currentEvent.getTitle(),
                                linkedClub.getName(),
                                currentEvent.getId()
                        )
                );

                return "The event has been officially approved and is now live on the platform.";

            default:
                throw new AccessDeniedException("Unauthorized: Your role is not permitted to perform this action.");
        }
    }

    @Override
    @Transactional
    public String revertEventByRole(Integer eventId, String remarks, CustomUserDetails currentUser) throws AccessDeniedException {
        Role userRole = currentUser.getUser().getRole();
        String userEmail = currentUser.getUser().getEmail();

        Event currentEvent = entityLookupService.getEvent(eventId);
        Club linkedClub = currentEvent.getClub();
        EventLog eventLog;
        EventLog existingLog = eventLogRepository.findFirstByEventOrderByIdDesc(currentEvent)
                .orElseThrow(()-> new RuntimeException("No previous logs found for current event!"));

        Role forwardedTo;
        EventStatus fromStatus;

        switch (userRole) {
            case ROLE_FACULTY:
                Staff curFaculty = entityLookupService.getStaff(userEmail);

                validationHelperService.validateIsClubCoordinator(curFaculty);

                validationHelperService.validateIsClubCoordinatorOfSpecifiedClub(curFaculty, linkedClub.getId());

                currentEvent.setStatus(EventStatus.REVERTED);
                currentEvent.setPendingApprovalAt(Role.ROLE_CLUB);
                eventRepository.save(currentEvent);

                eventLog = eventLogMapper.toEventLogEntity(
                        EventStatus.REVERTED,
                        Role.ROLE_FACULTY,
                        Role.ROLE_CLUB,
                        EventStatus.SUBMITTED,
                        EventStatus.REVERTED,
                        remarks,
                        currentEvent,
                        existingLog.getVersion()
                        );

                eventLogRepository.save(eventLog);

                // =================================
                // NOTIFICATION TO CLUB ADMIN ABOUT FACULTY REVERT
                // =================================

                revertEventNotification(currentEvent);

                // =================================
                // EMAIL TO CLUB ADMIN ABOUT FACULTY REVERT
                // =================================
                sendEmailToClubOnEventRevert(linkedClub, currentEvent, "Faculty Coordinator", remarks);

                return "Event successfully reverted back to the " + linkedClub.getName() + " from Faculty Coordinator's desk";

            case ROLE_HOD:
                Staff curHod = entityLookupService.getStaff(userEmail);

                validationHelperService.validateIsHod(curHod);

                validationHelperService.validateIsHodOfSpecifiedBranch(curHod, linkedClub.getBranch().getId());

                currentEvent.setStatus(EventStatus.REVERTED);
                currentEvent.setPendingApprovalAt(Role.ROLE_CLUB);
                eventRepository.save(currentEvent);

                eventLog = eventLogMapper.toEventLogEntity(
                        EventStatus.REVERTED,
                        Role.ROLE_HOD,
                        Role.ROLE_CLUB,
                        EventStatus.FACULTY1_APPROVED,
                        EventStatus.REVERTED,
                        remarks,
                        currentEvent,
                        existingLog.getVersion());

                eventLogRepository.save(eventLog);

                // =================================
                // NOTIFICATION TO CLUB ADMIN ABOUT REVERT
                // =================================

                revertEventNotification(currentEvent);

                // =================================
                // EMAIL TO CLUB ADMIN ABOUT FACULTY REVERT
                // =================================
                sendEmailToClubOnEventRevert(linkedClub, currentEvent, "Head Of Department", remarks);

                return "Event successfully reverted back to the " + linkedClub.getName() + " from Departmental/HOD desk";

            case ROLE_PRINCIPAL:
                College curPrincipal = entityLookupService.getCollege(userEmail);

                validationHelperService.validateClubBelongsToSpecifiedCollege(linkedClub, currentUser.getCollegeId());

                if (linkedClub.getBranch() == null)
                    fromStatus = EventStatus.FACULTY1_APPROVED;
                else
                    fromStatus = EventStatus.HOD_APPROVED;

                currentEvent.setStatus(EventStatus.REVERTED);
                currentEvent.setPendingApprovalAt(Role.ROLE_CLUB);
                eventRepository.save(currentEvent);

                eventLog = eventLogMapper.toEventLogEntity(
                        EventStatus.REVERTED,
                        Role.ROLE_PRINCIPAL,
                        Role.ROLE_CLUB,
                        fromStatus,
                        EventStatus.REVERTED,
                        remarks,
                        currentEvent,
                        existingLog.getVersion()
                );

                eventLogRepository.save(eventLog);

                // =================================
                // NOTIFICATION TO CLUB ADMIN ABOUT REVERT
                // =================================
                revertEventNotification(currentEvent);

                // =================================
                // EMAIL TO CLUB ADMIN ABOUT FACULTY REVERT
                // =================================
                sendEmailToClubOnEventRevert(linkedClub, currentEvent, "Principal", remarks);

                return "Event successfully reverted back to the " + linkedClub.getName() + " from Principal's desk";

            default:
                throw new AccessDeniedException("Unauthorized: Your role is not permitted to perform this action.");
        }
    }

    @Override
    @Transactional
    public List<EventSummary> getRevertedEventsByClub(CustomUserDetails currentUser) throws AccessDeniedException {
        if(currentUser.getUser().getRole() != Role.ROLE_CLUB) {
            throw new AccessDeniedException("Unauthorized: You are not Club Admin!");
        }

        String userEmailFromClaims = currentUser.getUser().getEmail();
        Integer collegeIdFromClaims = currentUser.getCollegeId();

        Club currentClub = entityLookupService.getClub(userEmailFromClaims);

        validationHelperService.validateClubBelongsToSpecifiedCollege(currentClub, collegeIdFromClaims);

        List<Event> revertedEventsList = eventRepository.findAllByStatusAndPendingApprovalAtAndClub(
                EventStatus.REVERTED,
                Role.ROLE_CLUB,
                currentClub
            );

        if(revertedEventsList.isEmpty()) return Collections.emptyList();

        return revertedEventsList.stream()
                .map(event -> {
                    // 1. Convert to base DTO
                    EventSummary summary = eventMapper.convertToEventSummary(event);

                    // 2. Fetch the latest remark from the EventLog table
                    eventLogRepository.findFirstByEventOrderByIdDesc(event)
                            .ifPresent(log -> summary.setRemarks(log.getRemarks()));

                    return summary;
                })
                .toList();
    }

    @Override
    public List<EventLogResponse> getAllLogsByEventId(Integer eventId, CustomUserDetails currentUser) throws AccessDeniedException {
        Event curEvent = entityLookupService.getEvent(eventId);

        validationHelperService.validateEventBelongsToSpecifiedCollege(curEvent, currentUser.getCollegeId());

        Role userRole = currentUser.getUser().getRole();

        switch (userRole) {

            case ROLE_FACULTY -> {
                Staff curFaculty = entityLookupService.getStaff(currentUser.getProfileId());
                validationHelperService.validateIsClubCoordinatorOfSpecifiedClub(curFaculty, curEvent.getClub().getId());
            }

            case ROLE_HOD -> {
                Staff curStaff = entityLookupService.getStaff(currentUser.getProfileId());

                validationHelperService.validateIsHod(curStaff);
                validationHelperService.validateIsHodOfSpecifiedBranch(curStaff, curEvent.getClub().getBranch().getId());
            }

            case ROLE_CLUB -> {
                validationHelperService.validateEventBelongsToClub(curEvent, currentUser.getProfileId());
            }
        }

        List<EventLog> eventLogs = eventLogRepository.findAllByEventOrderByTimestampDesc(curEvent);

        if (eventLogs.isEmpty()) {
            return Collections.emptyList();
        }

        return eventLogs.stream()
                .map(eventLogMapper::toEventLogResponse)
                .toList();
    }


    // -------------------------------------------------------------------------------------------------------
    // ======================================== HELPER METHODS ===============================================
    // -------------------------------------------------------------------------------------------------------

    // ==================================
    // PRIVATE HELPER METHOD TO SEND NOTIFICATIONS ON EVENT REVERT
    // ==================================
    private void revertEventNotification(Event event) {
        String message = notificationUtils
                .eventStatusChangeNotificationMessage(
                        EventStatus.REVERTED,
                        event
                );

        notificationService.createNotification(
                event.getClub().getUser(),
                "Event Reverted",
                message,
                NotificationType.EVENT_STATUS_CHANGE,
                "/club-dashboard/inbox"
        );
    }

    private void sendEmailToClubOnEventRevert(Club linkedClub, Event currentEvent, String revertedBy, String remarks) {
        emailService.sendEmail(
                linkedClub.getAdminEmail(),
                EmailType.EVENT_REVERTED,
                emailUtils.buildEventRevertedEmail(
                        currentEvent.getTitle(),
                        linkedClub.getName(),
                        revertedBy,
                        remarks
                )
        );
    }
}
