package com.example.CampusUtsav.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentRegistrationsResponse {

    private Integer registrationId;
    private Integer eventId;

    private String eventTitle;
    private LocalDate eventStartDate;
    private LocalDate eventEndDate;
    private LocalTime startTime;
    private LocalTime endTime;

    private boolean attendanceActive;

    private String venue;
    private String clubName;
    private String clubShortForm;

    private Boolean attendanceMarked;
    private LocalDateTime markedAt;

    private String registrationType;
    private Integer teamId;
    private String teamName;
    private boolean isLeader;
    private Integer teamMemberId;
}