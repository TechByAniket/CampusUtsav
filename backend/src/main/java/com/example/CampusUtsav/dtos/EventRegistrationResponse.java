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
    private Integer registrationId;
    private Integer eventId;
    private String registrationType;
    private String message;
}
