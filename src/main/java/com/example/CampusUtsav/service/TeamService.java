package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.TeamMemberResponse;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;

public interface TeamService {

    String addMember(Integer teamId,
                     Integer studentId,
                     CustomUserDetails currentUser
    ) throws AccessDeniedException;

    List<TeamMemberResponse> getTeamMembers(Integer teamId,
                                            CustomUserDetails currentUser
    ) throws AccessDeniedException;
}
