package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.TeamMemberResponse;
import com.example.CampusUtsav.entity.*;
import com.example.CampusUtsav.entity.enums.NotificationType;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.entity.enums.TeamMemberStatus;
import com.example.CampusUtsav.entity.enums.TeamStatus;
import com.example.CampusUtsav.mapper.TeamMemberMapper;
import com.example.CampusUtsav.repository.*;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.NotificationService;
import com.example.CampusUtsav.service.TeamService;
import com.example.CampusUtsav.serviceImpl.helper.EntityLookupService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final StudentRepository studentRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final TeamMemberMapper teamMemberMapper;
    private final StaffRepository staffRepository;
    private final NotificationService notificationService;
    private final EntityLookupService entityLookupService;

    @Override
    @Transactional
    public String addMember(Integer teamId,
                            Integer studentId,
                            CustomUserDetails currentUser)
            throws AccessDeniedException {

        // =========================
        // Role check
        // =========================
        if (currentUser.getUser().getRole() != Role.ROLE_STUDENT) {
            throw new AccessDeniedException("Only students can add members");
        }



        // =========================
        // Fetch Team
        // =========================
        Team team = entityLookupService.getTeam(teamId);

        Event event = team.getEvent();

        // =========================
        // Ownership check (Leader only)
        // =========================
        if (!Objects.equals(team.getLeader().getId(), currentUser.getProfileId())) {
            throw new AccessDeniedException("Only team leader can add members");
        }

        // =========================
        // Team must not be cancelled
        // =========================
        if (team.getStatus() == TeamStatus.CANCELLED) {
            throw new RuntimeException("Cannot add members to cancelled team");
        }

        // =========================
        // Same college check
        // =========================
        if (!Objects.equals(currentUser.getCollegeId(),
                event.getClub().getCollege().getId())) {

            throw new AccessDeniedException("Not allowed for other college events");
        }

        // =========================
        // Fetch Student to add
        // =========================
        Student student = entityLookupService.getStudent(studentId);

        if(!Objects.equals(student.getCollege().getId(),currentUser.getCollegeId())){
            throw new RuntimeException("Cross college teams are not allowed!");
        }

        List<Integer> allowedBranches = event.getAllowedBranches();
        List<Integer> allowedYears = event.getAllowedYears();

        if (!allowedBranches.contains(student.getBranch().getId())) {
            throw new RuntimeException("Student from " + student.getBranch().getShortForm() + "branch are not allowed for this event!");
        }

        if (!allowedYears.contains(student.getYear())) {
            throw new RuntimeException("Student pursuing "+ student.getYear() +"year are not allowed for this event!");
        }

        // =========================
        // Prevent adding self again
        // =========================
        if (Objects.equals(student.getId(), currentUser.getProfileId())) {
            throw new RuntimeException("Leader is already part of the team");
        }

        // =========================
        // Check already individually registered
        // =========================
        if (eventRegistrationRepository.existsByEvent_IdAndStudent_Id(
                event.getId(), studentId)) {

            throw new RuntimeException("Student already individually registered");
        }

        // =========================
        // Check already in team (ACTIVE only)
        // =========================
        boolean alreadyInTeam = teamMemberRepository
                .existsByEvent_IdAndStudent_IdAndStatus(
                        event.getId(),
                        studentId,
                        TeamMemberStatus.ACTIVE
                );

        if (alreadyInTeam) {
            throw new RuntimeException("Student already in another team");
        }

        // =========================
        // Check max team size
        // =========================
        long activeMembers = team.getMembers()
                .stream()
                .filter(m -> m.getStatus() == TeamMemberStatus.ACTIVE)
                .count();

        if (event.getMaxTeamSize() != null &&
                activeMembers + 1 > event.getMaxTeamSize()) {

            throw new RuntimeException("Team already at maximum size");
        }

        // =========================
        // Create TeamMember
        // =========================
        TeamMember newMember = teamMemberMapper.toEntity(
                team,
                student,
                event,
                TeamMemberStatus.ACTIVE
        );

        teamMemberRepository.save(newMember);

        // =========================
        // Update team status if recovered
        // =========================
        long updatedSize = activeMembers + 1;

        if (event.getMinTeamSize() != null &&
                updatedSize >= event.getMinTeamSize()) {

            team.setStatus(TeamStatus.VALID);
        }

        // ===========================================
        // NOTIFY THE NEW MEMBER ABOUT ADDITION IN TEAM
        // ===========================================

        notificationService.createNotification(
                newMember.getStudent().getUser(),
                "Team Membership Updated",
                "Hi " + newMember.getStudent().getName() + ", you have been successfully added to the team '"
                        + team.getName()
                        + "' for the event '"
                        + event.getTitle()
                        + "'. "
                        + "Your team access is now active.",
                NotificationType.TEAM_UPDATE,
                "/users/registrations"
        );

        return "Member added successfully";
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamMemberResponse> getTeamMembers(Integer teamId,
                                                   CustomUserDetails currentUser
    ) throws AccessDeniedException {

        Role userRole = currentUser.getUser().getRole();
        Integer profileId = currentUser.getProfileId();
        Integer collegeId = currentUser.getCollegeId();

        // =========================
        // Fetch Team + Event
        // =========================
        Team team = entityLookupService.getTeam(teamId);

        Event event = team.getEvent();

        // =========================
        // ROLE-BASED ACCESS CONTROL
        // =========================

        // -------- PRINCIPAL --------
        if (userRole == Role.ROLE_PRINCIPAL &&
                !Objects.equals(event.getClub().getCollege().getId(), collegeId)) {

            throw new AccessDeniedException(
                    "You are not allowed to see registrations of other college's event!"
            );
        }

        // -------- HOD --------
        if (userRole == Role.ROLE_HOD) {

            Staff hod = entityLookupService.getStaff(profileId);

            if (!hod.isHod()) {
                throw new AccessDeniedException("You are not Head Of Department!");
            }

            if (!Objects.equals(hod.getBranch().getId(), event.getClub().getBranch().getId())) {
                throw new AccessDeniedException(
                        "You can't view teams of events from other branches!"
                );
            }
        }

        // -------- FACULTY --------
        if (userRole == Role.ROLE_FACULTY) {

            Staff faculty = entityLookupService.getStaff(profileId);

            if (!faculty.isClubCoordinator()) {
                throw new AccessDeniedException("You are not a Club Coordinator!");
            }

            if (!Objects.equals(faculty.getManagedClub().getId(), event.getClub().getId())) {
                throw new AccessDeniedException(
                        "You can't view teams of clubs you don't manage!"
                );
            }
        }

        // -------- CLUB ADMIN --------
        if (userRole == Role.ROLE_CLUB &&
                !Objects.equals(profileId, event.getClub().getId())) {

            throw new AccessDeniedException(
                    "You can't view teams of events not managed by your club!"
            );
        }

        // -------- STUDENT --------
        if (userRole == Role.ROLE_STUDENT) {

            boolean isLeader = Objects.equals(team.getLeader().getId(), profileId);

            boolean isMember = team.getMembers().stream()
                    .anyMatch(m ->
                            m.getStudent().getId().equals(profileId) &&
                                    m.getStatus() == TeamMemberStatus.ACTIVE
                    );

            if (!isLeader && !isMember) {
                throw new AccessDeniedException("You are not part of this team!");
            }
        }

        // =========================
        // BUILD RESPONSE (ACTIVE ONLY)
        // =========================
        return List.of(
                teamMemberMapper.toResponse(
                        team.getMembers().stream()
                                .filter(m -> m.getStatus() == TeamMemberStatus.ACTIVE)
                                .toList()
                )
        );
    }
}