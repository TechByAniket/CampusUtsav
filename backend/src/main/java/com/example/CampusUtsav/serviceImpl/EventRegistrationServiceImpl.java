package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.EventParticipantsResponse;
import com.example.CampusUtsav.dtos.EventRegistrationRequest;
import com.example.CampusUtsav.dtos.EventRegistrationResponse;
import com.example.CampusUtsav.dtos.miniDtos.StudentSummary;
import com.example.CampusUtsav.dtos.miniDtos.TeamParticipant;
import com.example.CampusUtsav.entity.*;
import com.example.CampusUtsav.entity.enums.*;
import com.example.CampusUtsav.mapper.EventRegistrationMapper;
import com.example.CampusUtsav.mapper.StudentMapper;
import com.example.CampusUtsav.mapper.TeamMapper;
import com.example.CampusUtsav.mapper.TeamMemberMapper;
import com.example.CampusUtsav.repository.*;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.EmailService;
import com.example.CampusUtsav.service.EventRegistrationService;
import com.example.CampusUtsav.service.NotificationService;
import com.example.CampusUtsav.serviceImpl.helper.EntityLookupService;
import com.example.CampusUtsav.serviceImpl.helper.ValidationHelperService;
import com.example.CampusUtsav.utils.EmailUtils;
import jakarta.persistence.EntityNotFoundException;
//import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.springframework.transaction.annotation.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.security.access.AccessDeniedException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@AllArgsConstructor
public class EventRegistrationServiceImpl implements EventRegistrationService {

    private final EventRepository eventRepository;
    private final StudentRepository studentRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final EventRegistrationMapper eventRegistrationMapper;
    private final CollegeRepository collegeRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberMapper teamMemberMapper;
    private final TeamMapper teamMapper;
    private final StudentMapper studentMapper;
    private final StaffRepository staffRepository;
    private final NotificationService notificationService;
    private final EntityLookupService entityLookupService;
    private final ValidationHelperService validationHelperService;
    private final EmailUtils emailUtils;
    private final EmailService emailService;

    @Override
    @Transactional
    public EventRegistrationResponse registerForEvent(
            Integer eventId,
            EventRegistrationRequest request,
            CustomUserDetails currentUser
    ) {

        // =========================
        // Validate Event
        // =========================
        Event event = entityLookupService.getEvent(eventId);

        validationHelperService.validateEventBelongsToSpecifiedCollege(event, currentUser.getCollegeId());

//        if (LocalDate.now().isAfter(event.getRegistrationDeadline())) {
//            throw new RuntimeException("Registration unsuccessful: Registration deadline passed!");
//        }

        String type = request.getRegistrationType().toUpperCase();

        if (type.equalsIgnoreCase("TEAM") && !event.isTeamEvent()){
            throw new RuntimeException("Selected event is not a team event!");
        }

        // ==================================================
        // INDIVIDUAL REGISTRATION
        // ==================================================
        if ("INDIVIDUAL".equals(type)) {

            Student student = entityLookupService.getStudent(request.getStudentId());

            if(!Objects.equals(request.getStudentId(), currentUser.getProfileId())){
                throw new RuntimeException("StudentID mismatched!");
            }

            if (eventRegistrationRepository.existsByEvent_IdAndStudent_Id(eventId, student.getId())) {
                throw new RuntimeException("Student already registered for this event");
            }

            if (teamMemberRepository.existsByEvent_IdAndStudent_Id(eventId, student.getId())) {
                throw new RuntimeException("Student already part of a team for this event");
            }

            EventRegistration registration = eventRegistrationMapper.toEntity(
                    event,
                    student,
                    null
            );

            registration.setStatus(RegistrationStatus.REGISTERED);

            registration = eventRegistrationRepository.save(registration);

            // =============================================
            // CONFIRMATION NOTIFICATION TO STUDENT
            // =============================================

            notificationService.createNotification(
                    student.getUser(),
                    "Event Registration Successful",
                    "You have successfully registered for '"
                            + event.getTitle()
                            + "'. We look forward to your participation.",
                    NotificationType.REGISTRATION_STATUS_CHANGE,
                    "/users/registrations"
            );

            // =============================================
            // EMAIL NOTIFICATION TO STUDENT
            // =============================================
            emailService.sendEmail(
                    student.getUser().getEmail(),
                    EmailType.REGISTRATION_CONFIRMED,
                    emailUtils.buildIndividualRegistrationSuccessfulEmail(
                            student.getName(),
                            event.getTitle()
                    )
            );

            return eventRegistrationMapper.toIndividualResponse(registration);
        }

        // ==================================================
        // TEAM REGISTRATION
        // ==================================================
        if ("TEAM".equals(type)) {

            // leader
            Student leader = entityLookupService.getStudent(request.getLeaderId());;

            if(!Objects.equals(request.getStudentId(), currentUser.getProfileId())){
                throw new RuntimeException("StudentID mismatched!");
            }

            // members (NULL SAFE + DISTINCT FIX)
            List<Student> members = Optional.ofNullable(request.getTeamMemberIds())
                    .orElseThrow(() -> new RuntimeException("Team members required"))
                    .stream()
                    .distinct()
                    .map(id -> studentRepository.findById(id)
                            .orElseThrow(() -> new EntityNotFoundException("Student not found: " + id)))
                    .toList();

            // ensure leader included
            if (members.stream().noneMatch(m -> m.getId().equals(leader.getId()))) {
                List<Student> updated = new ArrayList<>(members);
                updated.add(leader);
                members = updated;
            }

            // =========================
            // Team size validation
            // =========================
            int teamSize = members.size();

            if (event.getMinTeamSize() != null && teamSize < event.getMinTeamSize()) {
                throw new RuntimeException("Team size is less than minimum allowed ("
                        + event.getMinTeamSize() + ")");
            }

            if (event.getMaxTeamSize() != null && teamSize > event.getMaxTeamSize()) {
                throw new RuntimeException("Team size exceeds maximum allowed ("
                        + event.getMaxTeamSize() + ")");
            }

            // validate conflicts
            for (Student s : members) {

                if (eventRegistrationRepository.existsByEvent_IdAndStudent_Id(eventId, s.getId())) {
                    throw new RuntimeException("Already individually registered: " + s.getId());
                }

                if (teamMemberRepository.existsByEvent_IdAndStudent_Id(eventId, s.getId())) {
                    throw new RuntimeException("Already in another team: " + s.getId());
                }
            }

            // create team
            Team team = teamMapper.toEntity(request.getTeamName(), event, leader);

            team.setStatus(TeamStatus.VALID);

            team = teamRepository.save(team);

            // create team members
            Team finalTeam = team;
            List<TeamMember> teamMembers = members.stream()
                    .map(s -> {
                        TeamMember tm = teamMemberMapper.toEntity(finalTeam, s, event, TeamMemberStatus.ACTIVE);

                        tm.setStatus(TeamMemberStatus.ACTIVE);

                        return tm;
                    })
                    .toList();

            teamMemberRepository.saveAll(teamMembers);
            team.setMembers(teamMembers);

            // create registration
            EventRegistration registration = eventRegistrationMapper.toEntity(
                    event,
                    null,
                    team
            );

            registration.setStatus(RegistrationStatus.REGISTERED);

            registration = eventRegistrationRepository.save(registration);

            // =============================================
            // CONFIRMATION IN APP NOTIFICATION & EMAIL TO LEADER & TEAM MEMBERS
            // =============================================

            emailService.sendEmail(
                    leader.getUser().getEmail(),
                    EmailType.REGISTRATION_CONFIRMED,
                    emailUtils.buildTeamRegistrationSuccessfulEmail(
                            leader.getName(),
                            team.getName(),
                            event.getTitle()
                    )
            );

            for (Student member : members) {

                if (!member.getId().equals(leader.getId())) {

                    emailService.sendEmail(
                            member.getUser().getEmail(),
                            EmailType.TEAM_MEMBER_ADDED,
                            emailUtils.buildTeamMemberAddedEmail(
                                    member.getName(),
                                    team.getName(),
                                    event.getTitle(),
                                    leader.getName()
                            )
                    );
                }

                notificationService.createNotification(
                        member.getUser(),
                        "Team Registration Successful",
                        "Your team '" + team.getName()
                                + "' has been successfully registered for '"
                                + event.getTitle()
                                + "'. We look forward to your participation.",
                        NotificationType.REGISTRATION_STATUS_CHANGE,
                        "/users/registrations"
                );
            }

            return eventRegistrationMapper.toTeamResponse(registration);
        }

        throw new RuntimeException("Invalid registration type");
    }

    @Override
    @Transactional
    public String cancelEventRegistration(
            Integer registrationId,
            CustomUserDetails currentUser
    ) throws AccessDeniedException {

        // =========================
        // Roles
        // =========================
        Role role = currentUser.getUser().getRole();

        boolean isStudent = role == Role.ROLE_STUDENT;
        boolean isClubAdmin = role == Role.ROLE_CLUB;
        boolean isPrincipal = role == Role.ROLE_PRINCIPAL;

        // Block disallowed roles
        if (role == Role.ROLE_FACULTY || role == Role.ROLE_HOD) {
            throw new AccessDeniedException("You cannot perform this action!");
        }

        // =========================
        // Fetch Registration
        // =========================
        EventRegistration registration = entityLookupService.getEventRegistration(registrationId);

        if (registration.getStatus() != RegistrationStatus.REGISTERED) {
            throw new RuntimeException("Registration already cancelled");
        }

        Event event = registration.getEvent();

        // =========================
        // Ownership checks
        // =========================

        boolean isEventOwnerClub = isClubAdmin &&
                Objects.equals(currentUser.getProfileId(), event.getClub().getId());

        boolean isSameCollegePrincipal = isPrincipal &&
                Objects.equals(currentUser.getCollegeId(), event.getClub().getCollege().getId());

        // =========================
        // INDIVIDUAL REGISTRATION
        // =========================
        if (registration.getStudent() != null) {

            boolean isStudentOwner = isStudent &&
                    Objects.equals(registration.getStudent().getId(), currentUser.getProfileId());

            boolean isAllowed = isStudentOwner || isEventOwnerClub || isSameCollegePrincipal;

            if (!isAllowed) {
                throw new AccessDeniedException("Not allowed to cancel this registration");
            }

            // Soft DELETE
            String message;

            if (isStudentOwner) {
                registration.setStatus(RegistrationStatus.CANCELLED_BY_STUDENT);
                message = "You have successfully cancelled your registration for '"
                        + event.getTitle() + "'.";

            } else if (isEventOwnerClub) {
                registration.setStatus(RegistrationStatus.CANCELLED_BY_CLUB);
                message = "Your registration for '"
                        + event.getTitle()
                        + "' was cancelled by the event organizer.";

            } else {
                registration.setStatus(RegistrationStatus.CANCELLED_BY_PRINCIPAL);
                message = "Your registration for '"
                        + event.getTitle()
                        + "' was cancelled by the college administration.";
            }

            // ========================================
            // INFORMATION NOTIFICATION TO STUDENT
            // ========================================

            notificationService.createNotification(
                    registration.getStudent().getUser(),
                    "Event Registration Cancelled",
                    message,
                    NotificationType.REGISTRATION_STATUS_CHANGE,
                    "/users/registrations"
            );

            // ========================================
            // EMAIL NOTIFICATION TO STUDENT
            // ========================================
            String cancelledBy;

            if (isStudentOwner) {
                cancelledBy = "You";
            } else if (isEventOwnerClub) {
                cancelledBy = "Event Organizer";
            } else {
                cancelledBy = "College Administration";
            }

            emailService.sendEmail(
                    registration.getStudent().getUser().getEmail(),
                    EmailType.REGISTRATION_CANCELLED,
                    emailUtils.buildRegistrationCancelledEmail(
                            registration.getStudent().getName(),
                            event.getTitle(),
                            cancelledBy,
                            false
                    )
            );

            return "Individual registration cancelled successfully";
        }

        // =========================
        // TEAM REGISTRATION
        // =========================
        if (registration.getTeam() != null) {

            Team team = registration.getTeam();

            boolean isLeader = isStudent &&
                    Objects.equals(team.getLeader().getId(), currentUser.getProfileId());

            boolean isAllowed = isLeader || isEventOwnerClub || isSameCollegePrincipal;

            if (!isAllowed) {
                throw new AccessDeniedException("Not allowed to cancel this team");
            }

            // Cancel team
            team.setStatus(TeamStatus.CANCELLED);

            // Set member's status as LEFT
            team.getMembers().forEach(m -> m.setStatus(TeamMemberStatus.LEFT));

            // Set registration status
            String message;

            if (isLeader) {
                registration.setStatus(RegistrationStatus.CANCELLED_BY_LEADER);
                message = "Your team registration for '"
                        + event.getTitle()
                        + "' was cancelled by the team leader.";

            } else if (isEventOwnerClub) {
                registration.setStatus(RegistrationStatus.CANCELLED_BY_CLUB);
                message = "Your team registration for '"
                        + event.getTitle()
                        + "' was cancelled by the event organizer.";

            } else {
                registration.setStatus(RegistrationStatus.CANCELLED_BY_PRINCIPAL);
                message = "Your team registration for '"
                        + event.getTitle()
                        + "' was cancelled by the college administration.";
            }

            // ========================================
            // INFORMATION NOTIFICATION (IN APP & EMAIL) TO TEAM MEMBERS
            // ========================================

            String cancelledBy;

            if (isLeader) {
                cancelledBy = team.getLeader().getName();
            } else if (isEventOwnerClub) {
                cancelledBy = "Event Organizer";
            } else {
                cancelledBy = "College Administration";
            }

            for (TeamMember member : team.getMembers()) {

                String notificationMessage = message;

                if (isLeader && Objects.equals(member.getStudent().getId(), currentUser.getProfileId())) {
                    notificationMessage = "You have successfully cancelled your team registration for '"
                            + event.getTitle() + "'.";
                }

                emailService.sendEmail(
                        member.getStudent().getEmail(),
                        EmailType.REGISTRATION_CANCELLED,
                        emailUtils.buildRegistrationCancelledEmail(
                                member.getStudent().getName(),
                                event.getTitle(),
                                cancelledBy,
                                true
                        )
                );

                notificationService.createNotification(
                        member.getStudent().getUser(),
                        "Team Registration Cancelled",
                        notificationMessage,
                        NotificationType.REGISTRATION_STATUS_CHANGE,
                        "/users/registrations"
                );
            }

            return "Team registration cancelled successfully";
        }

        // =========================
        // FALLBACK
        // =========================
        throw new RuntimeException("Invalid registration");
    }

}