package com.example.CampusUtsav.mapper;

import com.example.CampusUtsav.dtos.TeamMemberResponse;
import com.example.CampusUtsav.dtos.miniDtos.TeamMemberSummary;
import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.Student;
import com.example.CampusUtsav.entity.Team;
import com.example.CampusUtsav.entity.TeamMember;
import com.example.CampusUtsav.entity.enums.TeamMemberStatus;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

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

    public TeamMemberResponse toResponse(List<TeamMember> members) {

        Team team = members.getFirst().getTeam();

        return TeamMemberResponse.builder()
                .minTeamSize(team.getEvent().getMinTeamSize())
                .maxTeamSize(team.getEvent().getMaxTeamSize())
                .members(
                        members.stream()
                                .filter(m -> m.getStatus() == TeamMemberStatus.ACTIVE)
                                .map(m -> {
                                    Student student = m.getStudent();

                                    return TeamMemberSummary.builder()
                                            .teamMemberId(m.getId())
                                            .studentId(student.getId())
                                            .name(student.getName())
                                            .branchShortForm(student.getBranch().getShortForm())
                                            .year(student.getYear())
                                            .division(student.getDivision())
                                            .rollNo(student.getRollNo())
                                            .isLeader(
                                                    student.getId().equals(team.getLeader().getId())
                                            )
                                            .build();
                                })
                                .toList()
                )
                .build();
    }
}
