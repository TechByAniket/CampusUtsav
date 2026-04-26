package com.example.CampusUtsav.dtos.miniDtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TeamParticipant {

    private Integer teamId;
    private String teamName;

    private StudentSummary leader;

    private List<StudentSummary> members;
}
