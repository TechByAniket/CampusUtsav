package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.EventParticipantsResponse;
import com.example.CampusUtsav.dtos.EventRegistrationRequest;
import com.example.CampusUtsav.dtos.EventRegistrationResponse;
import com.example.CampusUtsav.dtos.miniDtos.StudentSummary;
import com.example.CampusUtsav.dtos.miniDtos.TeamParticipant;
import com.example.CampusUtsav.entity.*;
import com.example.CampusUtsav.entity.enums.RegistrationStatus;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.entity.enums.TeamMemberStatus;
import com.example.CampusUtsav.entity.enums.TeamStatus;
import com.example.CampusUtsav.mapper.EventRegistrationMapper;
import com.example.CampusUtsav.mapper.StudentMapper;
import com.example.CampusUtsav.mapper.TeamMapper;
import com.example.CampusUtsav.mapper.TeamMemberMapper;
import com.example.CampusUtsav.repository.*;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.EventRegistrationService;
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
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        if (!Objects.equals(event.getClub().getCollege().getId(), currentUser.getCollegeId())) {
            throw new RuntimeException("Not allowed for other college events");
        }

//        if (LocalDate.now().isAfter(event.getRegistrationDeadline())) {
//            throw new RuntimeException("Registration unsuccessful: Registration deadline passed!");
//        }

        String type = request.getRegistrationType().toUpperCase();

        // ==================================================
        // INDIVIDUAL REGISTRATION
        // ==================================================
        if ("INDIVIDUAL".equals(type)) {

            Student student = studentRepository.findById(request.getStudentId())
                    .orElseThrow(() -> new EntityNotFoundException("Student not found"));

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

            return eventRegistrationMapper.toIndividualResponse(registration);
        }

        // ==================================================
        // TEAM REGISTRATION
        // ==================================================
        if ("TEAM".equals(type)) {

            // leader
            Student leader = studentRepository.findById(request.getLeaderId())
                    .orElseThrow(() -> new EntityNotFoundException("Leader not found"));

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
                        TeamMember tm = teamMemberMapper.toEntity(finalTeam, s, event);

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
        EventRegistration registration = eventRegistrationRepository
                .findById(registrationId)
                .orElseThrow(() -> new EntityNotFoundException("Registration not found"));

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
            if (isStudentOwner) {
                registration.setStatus(RegistrationStatus.CANCELLED_BY_STUDENT);
            } else if (isEventOwnerClub) {
                registration.setStatus(RegistrationStatus.CANCELLED_BY_CLUB);
            } else {
                registration.setStatus(RegistrationStatus.CANCELLED_BY_PRINCIPAL);
            }

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
            if (isLeader) {
                registration.setStatus(RegistrationStatus.CANCELLED_BY_LEADER);
            } else if (isEventOwnerClub) {
                registration.setStatus(RegistrationStatus.CANCELLED_BY_CLUB);
            } else {
                registration.setStatus(RegistrationStatus.CANCELLED_BY_PRINCIPAL);
            }

            return "Team registration cancelled successfully";
        }

        // =========================
        // FALLBACK
        // =========================
        throw new RuntimeException("Invalid registration");
    }

}