package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.*;
import com.example.CampusUtsav.dtos.miniDtos.*;
import com.example.CampusUtsav.entity.*;
import com.example.CampusUtsav.entity.enums.*;
import com.example.CampusUtsav.mapper.EventLogMapper;
import com.example.CampusUtsav.mapper.EventMapper;
import com.example.CampusUtsav.mapper.EventRegistrationMapper;
import com.example.CampusUtsav.mapper.StudentMapper;
import com.example.CampusUtsav.repository.*;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.EventLogService;
import com.example.CampusUtsav.service.EventService;
import com.example.CampusUtsav.service.NotificationService;
import com.example.CampusUtsav.service.SupabaseService;
import com.example.CampusUtsav.utils.EventUtils;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EventServiceImpl implements EventService {

    private final ClubRepository clubRepository;
    private final CollegeRepository collegeRepository;
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;
    private final SupabaseService supabaseService;
    private final EventLogMapper eventLogMapper;
    private final EventLogRepository eventLogRepository;
    private final BranchRepository branchRepository;
    private final StaffRepository staffRepository;
    private final StudentMapper studentMapper;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final EventRegistrationMapper eventRegistrationMapper;
    private final NotificationService notificationService;
    private final EventUtils eventUtils;

    @Override
    public List<String> getAllEventTypes() {
        return Arrays.stream(EventType.values())
                .map(Enum::name)
                .toList();
    }

    @Override
    public List<String> getAllEventStatuses() {
        return Arrays.stream(EventStatus.values())
                .map(Enum::name)
                .toList();
    }

    @Override
    @Transactional
    public String createEvent(EventRequest request, MultipartFile file, Integer clubId) {
        Club linkedClub = clubRepository.findById(clubId)
                .orElseThrow(()-> new EntityNotFoundException("Club Not Found"));

        College linkedCollege = linkedClub.getCollege();

        String normalizedTitle = request.getTitle().trim().toLowerCase().replaceAll("\\s+", "");

        boolean exists = eventRepository.existsByNormalizedTitleAndStartDateAndClubId(
                normalizedTitle, request.getStartDate(), linkedClub.getId());

        if (exists) {
            throw new IllegalArgumentException("Event with same title, date and club already exists");
        }
//        College linkedCollege = collegeRepository.findById(linkedClub.getCollege().getId())
//                .orElseThrow(()-> new EntityNotFoundException("College Not Found!"));

        String posterUrl = supabaseService.uploadFile(file);
        if(posterUrl.isEmpty()){
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to upload event poster"
            );
        }
        Event newEvent = eventMapper.convertToEventEntity(request, linkedCollege, linkedClub);

        newEvent = eventRepository.save(newEvent);
        newEvent.setPosterUrl(posterUrl);

        //------ Add this log in the eventlog table ------//
        EventStatus action = EventStatus.SUBMITTED;
        Role actionBy = Role.ROLE_CLUB;
        Role forwardedTo = checkForwardingRole(newEvent);
        EventStatus fromStatus = EventStatus.PENDING;
        EventStatus toStatus = EventStatus.SUBMITTED;
        String remarks = "Event Submitted for approvals";

        EventLog eventLog = eventLogMapper.toEventLogEntity(action, actionBy, forwardedTo, fromStatus,toStatus, remarks, newEvent, 1);
        eventLogRepository.save(eventLog);

        // =======================================
        // NOTIFY NEXT APPROVER ABOUT EVENT SUBMISSION
        // SEND CONFIRMATION NOTIFICATION TO CLUB
        // =======================================

        // =======================================
        // CONFIRMATION NOTIFICATION TO CLUB
        // =======================================

        notificationService.createNotification(
                linkedClub.getUser(),
                "Event Submitted Successfully",
                "Hello " + linkedClub.getShortForm() + " Team,\n\n"
                        + "Your event proposal '" + newEvent.getTitle()
                        + "' has been submitted successfully and is now under review.",
                NotificationType.EVENT_SUBMITTED,
                "/club-dashboard/events/" + newEvent.getId()
        );

        // =======================================
        // NOTIFICATION TO NEXT APPROVER
        // =======================================

        EventUtils.ApproverInfo info = eventUtils.buildApproverInfo(forwardedTo, newEvent, linkedClub, linkedCollege);
        User approverUser = info.approverUser();
        String approverMessage = info.approverMessage();

        // =======================================
        // CREATE NOTIFICATION FOR APPROVER
        // =======================================

        notificationService.createNotification(
                approverUser,
                "New Event Approval Request",
                approverMessage,
                NotificationType.EVENT_SUBMITTED,
                approverUser.getRole() == Role.ROLE_PRINCIPAL
                        ? "/college-dashboard/inbox"
                        : "/staff-dashboard/inbox"
        );

        return "Event successfully created and submitted for approvals!";
    }

    @Override
    @Transactional
    public String resubmitEvent(EventRequest request, MultipartFile file, Integer eventId, CustomUserDetails currentClub) throws AccessDeniedException {

        // 1. Fetch the EXISTING event first
        Event curEvent = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with ID: " + eventId));

        // 2. Validation Checks
        if (curEvent.getStatus() != EventStatus.REVERTED) {
            throw new RuntimeException("Only REVERTED events can be resubmitted. Current status: " + curEvent.getStatus());
        }

        if (!Objects.equals(currentClub.getProfileId(), curEvent.getClub().getId())) {
            throw new AccessDeniedException("Unauthorized: You cannot resubmit events of other clubs.");
        }

        // 3. Update Fields (Do not create a new Object, update the existing one)
        // Use your mapper to update 'curEvent' with 'request' data
        eventMapper.updateEventFromRequest(request, curEvent);

        // 4. Handle Poster (Only upload if a new file is provided)
        if (file != null && !file.isEmpty()) {
            String newPosterUrl = supabaseService.uploadFile(file);
            if (newPosterUrl == null || newPosterUrl.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload poster");
            }
            curEvent.setPosterUrl(newPosterUrl);
        }

        // 5. Reset Event Status for the Workflow
        curEvent.setStatus(EventStatus.SUBMITTED); // Or SUBMITTED, depending on your enum logic
        eventRepository.save(curEvent);

        // 6. Log the Versioning
        EventLog lastLog = eventLogRepository.findFirstByEventOrderByIdDesc(curEvent)
                .orElseThrow(() -> new RuntimeException("Previous event log not found!"));

        EventStatus action = EventStatus.SUBMITTED;
        Role actionBy = Role.ROLE_CLUB;
        Role forwardedTo = checkForwardingRole(curEvent);
        EventStatus fromStatus = EventStatus.REVERTED; // Fixed: It was coming FROM reverted
        EventStatus toStatus = EventStatus.SUBMITTED;
        String remarks = "Event Re-Submitted for approvals";
        Integer newVersion = lastLog.getVersion() + 1;

        EventLog newLog = eventLogMapper.toEventLogEntity(
                action, actionBy, forwardedTo, fromStatus, toStatus, remarks, curEvent, newVersion
        );

        eventLogRepository.save(newLog);

        // =======================================
        // CONFIRMATION NOTIFICATION TO CLUB
        // =======================================

        notificationService.createNotification(
                currentClub.getUser(),
                "Event Re-Submitted Successfully",
                "Hello " + curEvent.getClub().getShortForm() + " Team,\n\n"
                        + "Your event proposal '" + curEvent.getTitle()
                        + "' has been re-submitted successfully and is now under review.",
                NotificationType.EVENT_SUBMITTED,
                "/club-dashboard/events/" + curEvent.getId()
        );

        // =======================================
        // NOTIFICATION TO NEXT APPROVER
        // =======================================

        EventUtils.ApproverInfo info = eventUtils.buildApproverInfo(forwardedTo, curEvent, curEvent.getClub(), curEvent.getClub().getCollege());
        User approverUser = info.approverUser();
        String approverMessage = info.approverMessage();

        // =======================================
        // CREATE NOTIFICATION FOR APPROVER
        // =======================================

        notificationService.createNotification(
                approverUser,
                "New Re-Submitted Event Approval Request",
                approverMessage,
                NotificationType.EVENT_SUBMITTED,
                approverUser.getRole() == Role.ROLE_PRINCIPAL
                        ? "/college-dashboard/inbox"
                        : "/staff-dashboard/inbox"
        );

        return "Event successfully updated and resubmitted for further approvals!";
    }

    @Override
    public List<EventSummary> getAllEventsByCollege(Integer collegeId, CustomUserDetails currentUser) throws AccessDeniedException {
        if (collegeId == null) {
            throw new IllegalArgumentException("Invalid College Id!");
        }
        College curCollege = collegeRepository.findById(collegeId)
                .orElseThrow(()-> new RuntimeException("College not found!"));

        if(!Objects.equals(collegeId, currentUser.getCollegeId())){
            throw new AccessDeniedException("Unauthorised: You cannot view another college's events!");
        }

        // get only the approved events
        List<Event> events = eventRepository.findByClub_College_IdAndStatus(collegeId, EventStatus.APPROVED);

        if(events.isEmpty()) return Collections.emptyList();

        return events.stream()
                .map(eventMapper :: convertToEventSummary)
                .toList();
    }

    @Override
    public List<EventSummary> getAllEventsByClub(Integer clubId) {

        List<Event> eventsByClub = eventRepository.findByClub_Id(clubId);

        return eventsByClub.stream()
                .map(eventMapper::convertToEventSummary) // or EventMapper.toSummary(event)
                .toList();
    }

    @Override
    public EventResponse getEventDetailsByEventId(Integer eventId, CustomUserDetails currentUser) throws AccessDeniedException {
        Event curEvent = eventRepository.findById(eventId)
                .orElseThrow(()-> new RuntimeException("Event not found!"));

        if(!Objects.equals(curEvent.getClub().getCollege().getId() , currentUser.getCollegeId())){
            throw new AccessDeniedException("Unauthorised: Access Denied to events from other college!");
        }

        if((curEvent.getStatus() != EventStatus.APPROVED) && (currentUser.getUser().getRole() != Role.ROLE_CLUB)){
            throw new RuntimeException("Event is not approved!");
        }

        // Fetch all branch short forms in a single query
        List<Branch> branches = branchRepository.findAllById(curEvent.getAllowedBranches());

        // Convert the list of entities into a Map<Integer, String>
        Map<Integer, String> allowedBranches = branches.stream()
                .collect(Collectors.toMap(
                        Branch::getId,
                        Branch::getShortForm
                ));

        Map<Integer, String> yearLabels = Map.of(
                1, "FY",
                2, "SY",
                3, "TY",
                4, "FINAL"
        );

        Map<Integer, String> allowedYears = curEvent.getAllowedYears().stream()
                .collect(Collectors.toMap(
                        id -> id,
                        id -> yearLabels.getOrDefault(id, "Unknown")
                ));

        return eventMapper.convertToEventResponse(curEvent, allowedBranches, allowedYears);
    }

    @Override
    @Transactional(readOnly = true)
    public EventParticipantsResponse getEventParticipants(Integer eventId, CustomUserDetails currentUser) throws AccessDeniedException {

        Role userRole = currentUser.getUser().getRole();

        // =========================
        // 1. Validate Event
        // =========================
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        if(!Objects.equals(currentUser.getCollegeId(), event.getClub().getCollege().getId())){
            throw new AccessDeniedException("Unauthorised: You can't view participant details of other college's event!");
        }

        if(userRole == Role.ROLE_HOD){
            Staff curHod = staffRepository.findById(currentUser.getProfileId())
                    .orElseThrow(()-> new RuntimeException("HOD profile not found!"));

            if (!curHod.isHod()) throw new AccessDeniedException("You are not Head Of Department!");
            if(!Objects.equals(curHod.getBranch().getId(), event.getClub().getBranch().getId())){
                throw new AccessDeniedException("You can't view participants details of events that comes under different branches!");
            }
        }

        if(userRole == Role.ROLE_FACULTY){
            Staff curFaculty = staffRepository.findById(currentUser.getProfileId())
                    .orElseThrow(()-> new RuntimeException("Faculty profile not found!"));

            if (!curFaculty.isClubCoordinator()) throw new AccessDeniedException("You are not a Club Coordinator!");
            if(!Objects.equals(curFaculty.getManagedClub().getId(), event.getClub().getId())){
                throw new AccessDeniedException("You can't view participants details of events of clubs that you don't manage!");
            }
        }

        // =========================
        // 2. Fetch all registrations
        // =========================
        List<EventRegistration> registrations =
                eventRegistrationRepository.findByEvent_Id(eventId);

        // =========================
        // 3. Split INDIVIDUAL
        // =========================
        List<StudentSummary> individuals = registrations.stream()
                .filter(r -> r.getStudent() != null)
                .map(r -> studentMapper.convertToStudentSummary(r.getStudent()))
                .toList();

        // =========================
        // 4. GROUP TEAM MEMBERS
        // =========================
        List<TeamParticipant> teams = registrations.stream()
                .filter(r -> r.getTeam() != null)
                .map(r -> {

                    Team team = r.getTeam();

                    return new TeamParticipant(
                            team.getId(),
                            team.getName(),
                            studentMapper.convertToStudentSummary(team.getLeader()),

                            team.getMembers().stream()
                                    .map(m -> studentMapper.convertToStudentSummary(m.getStudent()))
                                    .toList()
                    );
                })
                .toList();

        // =========================
        // 5. Build response
        // =========================
        return new EventParticipantsResponse(
                event.getId(),
                event.getTitle(),
                individuals,
                teams
        );
    }


    // =====================================
    // FOR CLUBS, COLLEGES, FACULTIES TO SEE THE LIST OF REGISTRATIONS FOF EVENT
    // =====================================
    @Override
    @Transactional(readOnly = true)
    public EventRegistrationsAdminResponse getEventRegistrations(Integer eventId, CustomUserDetails currentUser) throws AccessDeniedException {

        Integer collegeId = currentUser.getCollegeId();
        Integer profileId = currentUser.getProfileId();
        Role userRole =  currentUser.getUser().getRole();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(()-> new RuntimeException("Event not found!"));

        if(userRole == Role.ROLE_PRINCIPAL && !Objects.equals(event.getClub().getCollege().getId(), collegeId)){
            throw new AccessDeniedException("You are not allowed to see registrations of other college's event!");
        }

        if (userRole == Role.ROLE_HOD) {
            Staff curHod = staffRepository.findById(currentUser.getProfileId())
                    .orElseThrow(()-> new RuntimeException("HOD profile not found!"));

            if (!curHod.isHod()) throw new AccessDeniedException("You are not Head Of Department!");
            if(!Objects.equals(curHod.getBranch().getId(), event.getClub().getBranch().getId())){
                throw new AccessDeniedException("You can't view registration details of events that comes under different branches!");
            }
        }

        if(userRole == Role.ROLE_FACULTY){
            Staff curFaculty = staffRepository.findById(currentUser.getProfileId())
                    .orElseThrow(()-> new RuntimeException("Faculty profile not found!"));

            if (!curFaculty.isClubCoordinator()) throw new AccessDeniedException("You are not a Club Coordinator!");
            if(!Objects.equals(curFaculty.getManagedClub().getId(), event.getClub().getId())){
                throw new AccessDeniedException("You can't view registration details of events of clubs that you don't manage!");
            }
        }

        // 2. Fetch full graph (single query)
        List<EventRegistration> registrations =
                eventRegistrationRepository.fetchFullEventGraph(eventId);

        // =========================
        // 👤 INDIVIDUAL REGISTRATIONS
        // =========================
        List<IndividualRegistration> individuals = registrations.stream()
                .filter(r ->
                        r.getStudent() != null
                                && r.getStatus() == RegistrationStatus.REGISTERED
                )
                .map(eventRegistrationMapper::toIndividualDTO)
                .toList();

        // =========================
        // 👥 TEAM REGISTRATIONS
        // =========================
        List<TeamRegistration> teams = registrations.stream()
                .filter(r -> r.getTeam() != null)
                .map(eventRegistrationMapper::toTeamDTO)
                .toList();

        // =========================
        // FINAL RESPONSE
        // =========================
        return new EventRegistrationsAdminResponse(eventId, individuals, teams);
    }

    // -------------------------------------------------------------------------------------------------------
    // ======================================== HELPER METHODS ===============================================
    // -------------------------------------------------------------------------------------------------------

    // ========================================
    // HELPER METHOD TO CHECK TO WHOM THE EVENT SHOULD BE FORWARDED BASED ON THE CLUB'S ASSOCIATION
    // ========================================
    private Role checkForwardingRole(Event newEvent) {
        if (newEvent.getClub().getCoordinator() != null) {
            return Role.ROLE_FACULTY;
        } else if (newEvent.getClub().getBranch() != null) {
            return Role.ROLE_HOD;
        } else {
            return Role.ROLE_PRINCIPAL;
        }
    }

}
