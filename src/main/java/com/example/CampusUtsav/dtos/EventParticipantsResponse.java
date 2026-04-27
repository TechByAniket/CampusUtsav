package com.example.CampusUtsav.dtos;

import com.example.CampusUtsav.dtos.miniDtos.StudentSummary;
import com.example.CampusUtsav.dtos.miniDtos.TeamParticipant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventParticipantsResponse {

    private Integer eventId;
    private String eventTitle;
    private List<StudentSummary> individuals;
    private List<TeamParticipant> teams;
}