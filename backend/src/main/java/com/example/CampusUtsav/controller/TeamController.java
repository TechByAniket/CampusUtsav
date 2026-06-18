package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.TeamMemberResponse;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/teams/{teamId}/members")
    public ResponseEntity<List<TeamMemberResponse>> getTeamMembers(@PathVariable Integer teamId,
                                                                   @AuthenticationPrincipal CustomUserDetails currentUser
    ) throws AccessDeniedException {

        List<TeamMemberResponse> response = teamService.getTeamMembers(teamId, currentUser);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}