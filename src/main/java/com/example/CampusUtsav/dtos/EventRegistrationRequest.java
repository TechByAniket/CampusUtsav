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

    @NotNull(message = "Event ID is required")
    private Integer eventId;

    @NotNull(message = "Student ID is required")
    private Integer studentId;

    private String teamName;

    @NotBlank(message = "Registration type is required")
    private String registrationType; // "INDIVIDUAL" or "TEAM"

    private String extraInfo; // optional, e.g., dynamic form data as JSON

    private List<Integer> teamMemberIds; // optional for team registrations
}