package com.example.CampusUtsav.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class AttendanceTokenResponse {
    private Integer eventId;
    private String token;
    private LocalDateTime expiresAt; // for UI countdown
}
