package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.Team;
import com.example.CampusUtsav.entity.TeamMember;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.entity.enums.TeamMemberStatus;
import com.example.CampusUtsav.entity.enums.TeamStatus;
import com.example.CampusUtsav.repository.TeamMemberRepository;
import com.example.CampusUtsav.repository.TeamRepository;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.TeamMemberService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TeamMemberServiceImpl implements TeamMemberService {

    private final TeamMemberRepository teamMemberRepository;
    private final TeamRepository teamRepository;

    @Override
    @Transactional
    public String leaveTeam(Integer teamMemberId,
                            CustomUserDetails currentUser)
            throws AccessDeniedException
    {

        // =========================
        // Role check
        // =========================
        Role role = currentUser.getUser().getRole();

        if (role != Role.ROLE_STUDENT) {
            throw new AccessDeniedException("Only students can leave a team");
        }

        // =========================
        // Fetch TeamMember
        // =========================
        TeamMember teamMember = teamMemberRepository.findById(teamMemberId)
                .orElseThrow(() -> new EntityNotFoundException("Team member not found"));

        Team team = teamMember.getTeam();
        Event event = team.getEvent();

        // =========================
        // Ownership check
        // =========================
        if (!Objects.equals(teamMember.getStudent().getId(), currentUser.getProfileId())) {
            throw new AccessDeniedException("You can only leave your own team");
        }

        // =========================
        // Same college check
        // =========================
        if (!Objects.equals(currentUser.getCollegeId(),
                event.getClub().getCollege().getId())) {
            throw new AccessDeniedException("You cannot leave team of another college");
        }

        // =========================
        // Already left check
        // =========================
        if (teamMember.getStatus() == TeamMemberStatus.LEFT) {
            throw new RuntimeException("You have already left this team");
        }

        // =========================
        // Leader restriction
        // =========================
        if (Objects.equals(team.getLeader().getId(), currentUser.getProfileId())) {
            throw new RuntimeException("Leader cannot leave team. Delete team instead.");
        }

        // =========================
        // Mark as LEFT
        // =========================
        teamMember.setStatus(TeamMemberStatus.LEFT);

        // =========================
        // Recalculate active members
        // =========================
        long activeMembers = team.getMembers()
                .stream()
                .filter(m -> m.getStatus() == TeamMemberStatus.ACTIVE)
                .count();

        // =========================
        // Update team status
        // =========================
        if (event.getMinTeamSize() != null &&
                activeMembers < event.getMinTeamSize()) {

            team.setStatus(TeamStatus.INCOMPLETE);
        }

        return "You have successfully left the team";
    }

    @Override
    @Transactional
    public String removeMember(Integer teamMemberId,
                               CustomUserDetails currentUser
    ) throws AccessDeniedException {

        // =========================
        // Role check
        // =========================
        if (currentUser.getUser().getRole() != Role.ROLE_STUDENT) {
            throw new AccessDeniedException("Only leader can remove members");
        }

        // =========================
        // Fetch TeamMember
        // =========================
        TeamMember member = teamMemberRepository.findById(teamMemberId)
                .orElseThrow(() -> new EntityNotFoundException("Team member not found"));

        Team team = member.getTeam();
        Event event = team.getEvent();

        // =========================
        // Leader check
        // =========================
        if (!Objects.equals(team.getLeader().getId(), currentUser.getProfileId())) {
            throw new AccessDeniedException("Only leader can remove members");
        }

        // =========================
        // Cannot remove leader
        // =========================
        if (Objects.equals(member.getStudent().getId(), team.getLeader().getId())) {
            throw new RuntimeException("Leader cannot remove themselves");
        }

        // =========================
        // Already inactive check
        // =========================
        if (member.getStatus() != TeamMemberStatus.ACTIVE) {
            throw new RuntimeException("Member already removed or left");
        }

        // =========================
        // Same college check
        // =========================
        if (!Objects.equals(currentUser.getCollegeId(),
                event.getClub().getCollege().getId())) {

            throw new AccessDeniedException("Not allowed for other college events");
        }

        // =========================
        // Remove member
        // =========================
        member.setStatus(TeamMemberStatus.REMOVED_BY_LEADER);

        // =========================
        // Recalculate team size
        // =========================
        long activeMembers = team.getMembers().stream()
                .filter(m -> m.getStatus() == TeamMemberStatus.ACTIVE)
                .count();

        if (event.getMinTeamSize() != null &&
                activeMembers < event.getMinTeamSize()) {

            team.setStatus(TeamStatus.INCOMPLETE);
        }

        return "Member removed successfully";
    }
}