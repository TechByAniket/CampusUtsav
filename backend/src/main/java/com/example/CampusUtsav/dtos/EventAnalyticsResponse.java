package com.example.CampusUtsav.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventAnalyticsResponse {

    private int totalRegistrations;

    private int individualRegistrations;
    private int teamRegistrations;

    private int totalParticipants;

    private int totalAttendance;

    private double attendanceRate;

    private double dropOffRate;
}