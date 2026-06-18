package com.example.CampusUtsav.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventRegistrationRequest {

    private Integer studentId;

    private Integer leaderId;

    private String teamName;

    private String registrationType; // "INDIVIDUAL" or "TEAM"

    private List<Integer> teamMemberIds;
}