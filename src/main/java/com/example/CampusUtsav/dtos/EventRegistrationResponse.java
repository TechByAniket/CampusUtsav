package com.example.CampusUtsav.dtos;

import com.example.CampusUtsav.dtos.miniDtos.EventSummary;
import com.example.CampusUtsav.dtos.miniDtos.StudentSummary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventRegistrationResponse {
    private Integer id;
    private String teamName;
    private String registrationType;
    private Boolean paymentDone;
    private Boolean attended;
    private String inviteCode;
    private String inviteUrl;
    private LocalDateTime registeredAt;

    private EventSummary event;   // custom mini DTO
    private StudentSummary student; // mini DTO
    private List<StudentSummary> teamMembers;
}
