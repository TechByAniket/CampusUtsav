package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.TeamMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class TeamMemberController {

    private final TeamMemberService teamMemberService;

    // ===============================
    // TEAM MEMBER LEAVING TEAM
    // ===============================
    @PatchMapping("/team-members/{teamMemberId}/leave")
    public ResponseEntity<String> leaveTeam(@PathVariable Integer teamMemberId,
                                            @AuthenticationPrincipal CustomUserDetails currentUser) throws AccessDeniedException {

        String response = teamMemberService.leaveTeam(teamMemberId, currentUser);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // ===============================
    // LEADER REMOVING TEAM MEMBER
    // ===============================
    @PatchMapping("/team-members/{teamMemberId}/remove")
    public ResponseEntity<String> removeMember(@PathVariable Integer teamMemberId,
                                               @AuthenticationPrincipal CustomUserDetails currentUser
    ) throws AccessDeniedException {

        String response = teamMemberService.removeMember(teamMemberId, currentUser);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
