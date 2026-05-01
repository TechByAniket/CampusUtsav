package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.Student;
import com.example.CampusUtsav.entity.Team;
import com.example.CampusUtsav.entity.TeamMember;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.entity.enums.TeamMemberStatus;
import com.example.CampusUtsav.entity.enums.TeamStatus;
import com.example.CampusUtsav.mapper.TeamMemberMapper;
import com.example.CampusUtsav.repository.EventRegistrationRepository;
import com.example.CampusUtsav.repository.StudentRepository;
import com.example.CampusUtsav.repository.TeamMemberRepository;
import com.example.CampusUtsav.repository.TeamRepository;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.TeamService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final StudentRepository studentRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final TeamMemberMapper teamMemberMapper;

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
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new EntityNotFoundException("Team not found"));

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
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));

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

        return "Member added successfully";
    }
}