package com.example.CampusUtsav.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class EventAttendanceStatusResponse {
    private boolean active;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
