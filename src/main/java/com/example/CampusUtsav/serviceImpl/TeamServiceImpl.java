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
import com.example.CampusUtsav.serviceImpl.helper.ValidationHelperService;
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
    private final ValidationHelperService validationHelperService;

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
        boolean isCurStudentLeader = validationHelperService.validateIsCurrentStudentLeader(team.getLeader(), currentUser.getProfileId());
        if (!isCurStudentLeader) {
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
        validationHelperService.validateEventBelongsToSpecifiedCollege(event, currentUser.getCollegeId());

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
        switch (userRole) {

            case ROLE_PRINCIPAL -> {
                validationHelperService.validateEventBelongsToSpecifiedCollege(event, collegeId);
            }

            case ROLE_HOD -> {

                Staff hod = entityLookupService.getStaff(profileId);

                validationHelperService.validateIsHod(hod);
                validationHelperService.validateIsHodOfSpecifiedBranch(hod, event.getClub().getBranch().getId());
            }

            case ROLE_FACULTY -> {

                Staff faculty = entityLookupService.getStaff(profileId);

                validationHelperService.validateIsClubCoordinator(faculty);
                validationHelperService.validateIsClubCoordinatorOfSpecifiedClub(faculty, event.getClub().getId());
            }

            case ROLE_CLUB -> {
                validationHelperService.validateEventBelongsToClub(event, profileId);
            }

            case ROLE_STUDENT -> {

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