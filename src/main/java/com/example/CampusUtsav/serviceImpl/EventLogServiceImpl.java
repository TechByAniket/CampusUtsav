package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.EventLogResponse;
import com.example.CampusUtsav.dtos.EventResponse;
import com.example.CampusUtsav.dtos.miniDtos.EventSummary;
import com.example.CampusUtsav.entity.*;
import com.example.CampusUtsav.entity.enums.EventStatus;
import com.example.CampusUtsav.entity.enums.NotificationType;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.mapper.EventLogMapper;
import com.example.CampusUtsav.mapper.EventMapper;
import com.example.CampusUtsav.repository.*;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.EventLogService;
import com.example.CampusUtsav.service.NotificationService;
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


    @Override
    @Transactional(readOnly = true)
    public List<EventSummary> getAllPendingEventsByRole(Integer collegeId, Role userRole, CustomUserDetails currentUser) throws AccessDeniedException {

        String userEmail = currentUser.getUser().getEmail();
        List<Event> pendingEvents;

        switch(userRole) {
            case ROLE_FACULTY:
                Staff curFaculty = staffRepository.findByEmail(userEmail)
                        .orElseThrow(() -> new RuntimeException("Faculty profile not found!"));

                // Security check: Only if they are actually a coordinator
                if (!curFaculty.isClubCoordinator()) {
                    throw new AccessDeniedException("Error: You are not assigned as a Coordinator for any Club.");
                }

                pendingEvents = eventRepository.findAllByClub_Coordinator_EmailAndStatusAndPendingApprovalAt(
                        userEmail,
                        EventStatus.SUBMITTED,
                        Role.ROLE_FACULTY
                );
                break;

            case ROLE_HOD:
                Staff curStaff = staffRepository.findByEmail(userEmail)
                        .orElseThrow(() -> new RuntimeException("HOD profile not found!"));

                if (!curStaff.isHod()) {
                    throw new AccessDeniedException("Unauthorized: You do not have HOD privileges.");
                }

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

        Event currentEvent = eventRepository.findById(eventId)
                .orElseThrow(()-> new RuntimeException("Event not found!"));
        Club linkedClub = currentEvent.getClub();
        EventLog eventLog;
        EventLog existingLog = eventLogRepository.findFirstByEventOrderByIdDesc(currentEvent)
                .orElseThrow(()-> new RuntimeException("No previous logs found for current event!"));

        Role forwardedTo;
        EventStatus fromStatus;
        String message;

        switch(userRole){
            case ROLE_FACULTY:
                Staff curFaculty = staffRepository.findByEmail(userEmail)
                        .orElseThrow(()-> new RuntimeException("Faculty not found!"));

                if(!curFaculty.isClubCoordinator()){
                    throw new AccessDeniedException("Unauthorized: You are not a Faculty Coordinator of any CLUB/STUDENT CHAPTER!");
                }

                if(curFaculty.getManagedClub() == null || !Objects.equals(linkedClub.getId(), curFaculty.getManagedClub().getId())){
                    throw new AccessDeniedException("Unauthorized: You are not the faculty coordinator of :" + linkedClub.getName());
                }

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

                notificationService.createNotification(
                        approverUser,
                        "New Event Pending for Your Review",
                        approverMessage,
                        NotificationType.EVENT_STATUS_CHANGE,
                        approverUser.getRole() == Role.ROLE_HOD
                                ? "/staff-dashboard/inbox"
                                : "/college-dashboard/inbox"
                );

                if(forwardedTo == Role.ROLE_PRINCIPAL){
                    return "Event approved and successfully forwarded to the Principal for final authorization";
                }
                else return "Event approved and successfully forwarded to the Head of Department for further review.";

            case ROLE_HOD:
                Staff curHod = staffRepository.findByEmail(userEmail)
                        .orElseThrow(()-> new RuntimeException("HOD not found!"));

                if(!curHod.isHod()){
                    throw new AccessDeniedException("Unauthorized: You are not a Head of Department!");
                }

                if(curHod.getBranch() == null || !Objects.equals(linkedClub.getBranch().getId(), curHod.getBranch().getId())){
                    throw new AccessDeniedException("Unauthorized: You are not the Head of Department of :" + linkedClub.getBranch().getName());
                }

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

                notificationService.createNotification(
                        approverUser,
                        "New Event Pending for Your Review",
                        approverMessage,
                        NotificationType.EVENT_STATUS_CHANGE,
                        "/college-dashboard/inbox"
                );

                return "Departmental clearance granted. Forwarded to the Principal for final approval.";

            case ROLE_PRINCIPAL:
                College curPrincipal = collegeRepository.findByEmail(userEmail)
                        .orElseThrow(()-> new RuntimeException("College profile not found!"));

                if(!Objects.equals(linkedClub.getCollege().getId(), currentUser.getCollegeId())){
                    throw new AccessDeniedException("Security Alert: Unauthorized access. You cannot approve events from another college.");
                }

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

        Event currentEvent = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found!"));
        Club linkedClub = currentEvent.getClub();
        EventLog eventLog;
        EventLog existingLog = eventLogRepository.findFirstByEventOrderByIdDesc(currentEvent)
                .orElseThrow(()-> new RuntimeException("No previous logs found for current event!"));

        Role forwardedTo;
        EventStatus fromStatus;

        switch (userRole) {
            case ROLE_FACULTY:
                Staff curFaculty = staffRepository.findByEmail(userEmail)
                        .orElseThrow(() -> new RuntimeException("Faculty not found!"));

                if (!curFaculty.isClubCoordinator()) {
                    throw new AccessDeniedException("Unauthorized: You are not a Faculty Coordinator of any CLUB/STUDENT CHAPTER!");
                }

                if (curFaculty.getManagedClub() == null || !Objects.equals(linkedClub.getId(), curFaculty.getManagedClub().getId())) {
                    throw new AccessDeniedException("Unauthorized: You are not the faculty coordinator of :" + linkedClub.getName());
                }

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

                return "Event successfully reverted back to the " + linkedClub.getName() + " from Faculty Coordinator's desk";

            case ROLE_HOD:
                Staff curHod = staffRepository.findByEmail(userEmail)
                        .orElseThrow(() -> new RuntimeException("HOD not found!"));

                if (!curHod.isHod()) {
                    throw new AccessDeniedException("Unauthorized: You are not a Head of Department!");
                }

                if (curHod.getBranch() == null || !Objects.equals(linkedClub.getBranch().getId(), curHod.getBranch().getId())) {
                    throw new AccessDeniedException("Unauthorized: You are not the Head of Department of :" + linkedClub.getBranch().getName());
                }

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

                return "Event successfully reverted back to the " + linkedClub.getName() + " from Departmental/HOD desk";

            case ROLE_PRINCIPAL:
                College curPrincipal = collegeRepository.findByEmail(userEmail)
                        .orElseThrow(() -> new RuntimeException("College profile not found!"));

                if (!Objects.equals(linkedClub.getCollege().getId(), currentUser.getCollegeId())) {
                    throw new AccessDeniedException("Security Alert: Unauthorized access. You cannot approve events from another college.");
                }

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

        Club currentClub = clubRepository.findByAdminEmail(userEmailFromClaims)
                .orElseThrow(()-> new RuntimeException("Club not found!"));

        if (!Objects.equals(collegeIdFromClaims, currentClub.getCollege().getId())) {
            throw new AccessDeniedException("Security Alert: You do not have permission to manage events outside of your assigned college.");
        }

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
        Event curEvent = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found!"));

        if (!Objects.equals(curEvent.getClub().getCollege().getId(), currentUser.getCollegeId())) {
            throw new AccessDeniedException("Access Denied: You cannot view events from other colleges.");
        }

        Role userRole = currentUser.getUser().getRole();

        if (userRole == Role.ROLE_FACULTY) {
            if (!Objects.equals(currentUser.getProfileId(), curEvent.getClub().getCoordinator().getId())) {
                throw new AccessDeniedException("Access Denied: You are not the coordinator for " + curEvent.getClub().getShortForm());
            }
        }

        if (userRole == Role.ROLE_HOD) {
            Staff curStaff = staffRepository.findById(currentUser.getProfileId())
                    .orElseThrow(() -> new RuntimeException("Staff profile not found"));

            if (!curStaff.isHod()) throw new AccessDeniedException("Unauthorized: You do not have HOD privileges.");

            if (curEvent.getClub().getBranch() == null ||
                    !Objects.equals(curStaff.getBranch().getId(), curEvent.getClub().getBranch().getId())) {
                throw new AccessDeniedException("Access Denied: This club is outside your department's jurisdiction.");
            }
        }

        if (userRole == Role.ROLE_CLUB) {
            if (!Objects.equals(currentUser.getProfileId(), curEvent.getClub().getId())) {
                throw new AccessDeniedException("Access Denied: You can only view logs for your own events.");
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
}
