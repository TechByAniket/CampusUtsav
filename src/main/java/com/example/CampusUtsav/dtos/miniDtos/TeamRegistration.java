package com.example.CampusUtsav.dtos.miniDtos;

import com.example.CampusUtsav.entity.enums.TeamStatus;
import jakarta.annotation.security.DenyAll;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeamRegistration {

    private Integer registrationId;
    private TeamStatus status;

    private Integer teamId;
    private String teamName;

    private StudentSummary leader;
    private List<StudentSummary> members;

    private boolean paymentDone;
    private LocalDateTime registeredAt;
}