package com.example.CampusUtsav.mapper;

import com.example.CampusUtsav.dtos.EventRegistrationRequest;
import com.example.CampusUtsav.dtos.EventRegistrationResponse;
import com.example.CampusUtsav.dtos.miniDtos.IndividualRegistration;
import com.example.CampusUtsav.dtos.miniDtos.TeamRegistration;
import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.EventRegistration;
import com.example.CampusUtsav.entity.Student;
import com.example.CampusUtsav.entity.Team;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor
public class EventRegistrationMapper {

    private final EventMapper eventMapper;
    private final StudentMapper studentMapper;

    // ENTITY
    public EventRegistration toEntity(
            Event event,
            Student student,
            Team team
    ) {
        return EventRegistration.builder()
                .event(event)
                .student(student)
                .team(team)
                .paymentDone(false)
                .build();
    }

    // INDIVIDUAL RESPONSE
    public EventRegistrationResponse toIndividualResponse(EventRegistration reg) {

        return EventRegistrationResponse.builder()
                .registrationId(reg.getId())
                .eventId(reg.getEvent().getId())
                .registrationType("INDIVIDUAL")
                .message("Individual registration successful")
                .build();
    }

    // TEAM RESPONSE
    public EventRegistrationResponse toTeamResponse(EventRegistration reg) {

        return EventRegistrationResponse.builder()
                .registrationId(reg.getId())
                .eventId(reg.getEvent().getId())
                .registrationType("TEAM")
                .message("Team registration successful")
                .build();
    }

    // =========================
    // 👤 INDIVIDUAL REGISTRATION
    // =========================
    public IndividualRegistration toIndividualDTO(EventRegistration r) {

        return IndividualRegistration.builder()
                .registrationId(r.getId())
                .student(studentMapper.convertToStudentSummary(r.getStudent()))
                .paymentDone(r.isPaymentDone())
                .registeredAt(r.getRegisteredAt())
                .build();
    }

    // =========================
    // 👥 TEAM REGISTRATION
    // =========================
    public TeamRegistration toTeamDTO(EventRegistration r) {

        Team team = r.getTeam();

        return TeamRegistration.builder()
                .registrationId(r.getId())
                .teamId(team.getId())
                .teamName(team.getName())
                .leader(studentMapper.convertToStudentSummary(team.getLeader()))
                .members(
                        team.getMembers().stream()
                                .map(m -> studentMapper.convertToStudentSummary(m.getStudent()))
                                .toList()
                )
                .paymentDone(r.isPaymentDone())
                .registeredAt(r.getRegisteredAt())
                .build();
    }
}