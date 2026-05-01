package com.example.CampusUtsav.service;

import com.example.CampusUtsav.security.model.CustomUserDetails;
import org.springframework.security.access.AccessDeniedException;

public interface TeamService {

    String addMember(Integer teamId,
                     Integer studentId,
                     CustomUserDetails currentUser
    ) throws AccessDeniedException;
}
