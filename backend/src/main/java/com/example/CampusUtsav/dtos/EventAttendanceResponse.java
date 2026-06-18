package com.example.CampusUtsav.dtos;

import com.example.CampusUtsav.dtos.miniDtos.StudentAttendance;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class EventAttendanceResponse {

    private Integer eventId;
    private Integer totalParticipants;
    private Integer totalPresent;

    private List<StudentAttendance> attendees;
}