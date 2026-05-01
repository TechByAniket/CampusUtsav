package com.example.CampusUtsav.service;

import com.example.CampusUtsav.security.model.CustomUserDetails;
import org.springframework.security.access.AccessDeniedException;

public interface TeamMemberService {

    // ===============================
    // TEAM MEMBER LEAVING TEAM
    // ===============================
    String leaveTeam(Integer teamMemberId, CustomUserDetails currentUser) throws AccessDeniedException;
}
