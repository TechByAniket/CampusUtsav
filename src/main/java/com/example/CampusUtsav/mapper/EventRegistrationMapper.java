package com.example.CampusUtsav.mapper;

import com.example.CampusUtsav.dtos.EventRegistrationRequest;
import com.example.CampusUtsav.dtos.EventRegistrationResponse;
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
}