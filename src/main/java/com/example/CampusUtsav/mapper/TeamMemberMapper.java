package com.example.CampusUtsav.mapper;

import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.Student;
import com.example.CampusUtsav.entity.Team;
import com.example.CampusUtsav.entity.TeamMember;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class TeamMemberMapper {

    public TeamMember toEntity(Team team, Student student, Event event){
        return TeamMember.builder()
                .team(team)
                .event(event)
                .student(student)
                .build();

    }
}
