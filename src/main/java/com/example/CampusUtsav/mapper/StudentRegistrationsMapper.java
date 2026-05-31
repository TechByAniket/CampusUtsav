package com.example.CampusUtsav.mapper;

import com.example.CampusUtsav.dtos.StudentRegistrationsResponse;
import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.TeamMember;
import com.example.CampusUtsav.entity.enums.TeamMemberStatus;
import com.example.CampusUtsav.entity.enums.TeamStatus;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
@AllArgsConstructor
public class StudentRegistrationsMapper {

    public StudentRegistrationsResponse toStudentRegistrationsResponse(
            Event event,
            Integer registrationId,
            String registrationType,
            TeamMember teamMember
    ) {
        return StudentRegistrationsResponse.builder()
                .registrationId(registrationId)
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .eventStartDate(event.getStartDate())
                .eventEndDate(event.getEndDate())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .venue(event.getVenue())
                .clubName(event.getClub().getName())
                .clubShortForm(event.getClub().getShortForm())
                .attendanceActive(event.isAttendanceActive())
                .registrationType(registrationType)
                .teamId(
                        "TEAM".equals(registrationType)
                                && teamMember != null
                                && teamMember.getStatus() == TeamMemberStatus.ACTIVE
                                && teamMember.getTeam().getStatus() != TeamStatus.CANCELLED
                                ? teamMember.getTeam().getId()
                                : null
                )
                .isLeader(
                        "TEAM".equals(registrationType)
                                && teamMember != null
                                && teamMember.getStatus() == TeamMemberStatus.ACTIVE
                                && teamMember.getTeam().getStatus() != TeamStatus.CANCELLED
                                && Objects.equals(teamMember.getTeam().getLeader().getId(), teamMember.getStudent().getId())
                )
                .teamMemberId(
                        "TEAM".equals(registrationType)
                                && teamMember != null
                                && teamMember.getStatus() == TeamMemberStatus.ACTIVE
                                && teamMember.getTeam().getStatus() != TeamStatus.CANCELLED
                                ? teamMember.getId()
                                : null
                )
                .teamName(
                        "TEAM".equals(registrationType)
                                && teamMember != null
                                && teamMember.getStatus() == TeamMemberStatus.ACTIVE
                                && teamMember.getTeam().getStatus() != TeamStatus.CANCELLED
                                ? teamMember.getTeam().getName()
                                : null
                )
                .attendanceMarked(false)
                .build();
    }
}
