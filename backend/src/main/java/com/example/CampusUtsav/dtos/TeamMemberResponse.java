package com.example.CampusUtsav.dtos;

import com.example.CampusUtsav.dtos.miniDtos.TeamMemberSummary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TeamMemberResponse {

    private Integer minTeamSize;
    private Integer maxTeamSize;
    private List<TeamMemberSummary> members;

}