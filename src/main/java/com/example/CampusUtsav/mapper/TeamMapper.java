package com.example.CampusUtsav.mapper;

import com.example.CampusUtsav.dtos.TeamResponse;
import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.Student;
import com.example.CampusUtsav.entity.Team;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@AllArgsConstructor
public class TeamMapper {

    private final StudentMapper studentMapper;

    public Team toEntity(String teamName, Event event, Student leader) {
        return Team.builder()
                .name(teamName)
                .event(event)
                .leader(leader)
                .build();
    }

    public TeamResponse toResponse(Team team) {

        return TeamResponse.builder()
                .teamId(team.getId())
                .teamName(team.getName())
                .eventId(team.getEvent().getId())
                .leader(studentMapper.convertToStudentSummary(team.getLeader()))
                .members(
                        team.getMembers() == null ? List.of() :
                                team.getMembers().stream()
                                        .map(m -> studentMapper.convertToStudentSummary(m.getStudent()))
                                        .toList()
                )
                .build();
    }
}