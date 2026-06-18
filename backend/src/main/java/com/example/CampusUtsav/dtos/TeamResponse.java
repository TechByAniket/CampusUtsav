package com.example.CampusUtsav.dtos;

import com.example.CampusUtsav.dtos.miniDtos.StudentSummary;
import com.example.CampusUtsav.entity.Student;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.awt.*;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TeamResponse {
    private Integer teamId;
    private String teamName;
    private Integer eventId;
    private StudentSummary leader;
    private List<StudentSummary> members;
}
