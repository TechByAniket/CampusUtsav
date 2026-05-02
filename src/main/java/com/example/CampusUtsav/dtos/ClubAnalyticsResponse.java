package com.example.CampusUtsav.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClubAnalyticsResponse {

    private int totalEvents;
    private int eventsUnderApproval;
    private int totalRegistrations;
    private int totalAttendance;

    private double attendanceRate;

    private int individualRegistrations;
    private int teamRegistrations;
    private int totalParticipants;
    private int ongoingEvents;
    private int upcomingEvents;
    private int completedEvents;
}