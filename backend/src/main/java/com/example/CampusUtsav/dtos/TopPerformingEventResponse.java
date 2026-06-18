package com.example.CampusUtsav.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TopPerformingEventResponse {

    private Integer eventId;

    private String eventName;

    private String clubShortForm;

    private Integer totalParticipants;

    private Integer totalAttendance;

    private Double attendanceRate;
}
