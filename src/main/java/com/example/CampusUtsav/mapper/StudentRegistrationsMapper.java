package com.example.CampusUtsav.mapper;

import com.example.CampusUtsav.dtos.StudentRegistrationsResponse;
import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.TeamMember;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class StudentRegistrationsMapper {

    public StudentRegistrationsResponse toStudentRegistrationsResponse(
            Event event,
            String registrationType,
            TeamMember teamMember
    ) {
        return StudentRegistrationsResponse.builder()
                .eventId(event.getId())
                .eventTitle(event.getTitle())
                .eventDate(event.getDate())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .venue(event.getVenue())
                .clubName(event.getClub().getName())
                .clubShortForm(event.getClub().getShortForm())
                .registrationType(registrationType)
                .teamName(
                        "TEAM".equals(registrationType) && teamMember != null
                                ? teamMember.getTeam().getName()
                                : null
                )
                .attendanceMarked(false)
                .build();
    }
}
