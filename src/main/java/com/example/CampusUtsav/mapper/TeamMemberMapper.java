package com.example.CampusUtsav.mapper;

import com.example.CampusUtsav.dtos.TeamMemberResponse;
import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.Student;
import com.example.CampusUtsav.entity.Team;
import com.example.CampusUtsav.entity.TeamMember;
import com.example.CampusUtsav.entity.enums.TeamMemberStatus;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class TeamMemberMapper {

    public TeamMember toEntity(Team team, Student student, Event event, TeamMemberStatus status){
        return TeamMember.builder()
                .team(team)
                .event(event)
                .student(student)
                .status(status)
                .build();
    }

    public TeamMemberResponse toResponse(TeamMember member) {

        Student student = member.getStudent();

        return TeamMemberResponse.builder()
                .teamMemberId(member.getId())
                .studentId(student.getId())
                .name(student.getName())
                .branchShortForm(student.getBranch().getShortForm())
                .year(student.getYear())
                .division(student.getDivision())
                .rollNo(student.getRollNo())
                .isLeader(
                        student.getId().equals(member.getTeam().getLeader().getId())
                )
                .build();
    }
}
