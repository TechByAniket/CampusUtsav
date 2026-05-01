package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PatchMapping("/teams/{teamId}/add-member/{studentId}")
    public ResponseEntity<String> addMember(@PathVariable Integer teamId,
                                            @PathVariable Integer studentId,
                                            @AuthenticationPrincipal CustomUserDetails currentUser
    ) throws AccessDeniedException {

        String response = teamService.addMember(teamId, studentId, currentUser);
        return ResponseEntity.ok(response);
    }
}