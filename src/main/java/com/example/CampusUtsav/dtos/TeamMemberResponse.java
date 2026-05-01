package com.example.CampusUtsav.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TeamMemberResponse {

    private Integer teamMemberId;
    private Integer studentId;
    private String name;
    private String branchShortForm;
    private Integer year;
    private String division;
    private Integer rollNo;
    private boolean isLeader;
}