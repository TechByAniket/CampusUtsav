package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.EventLogResponse;
import com.example.CampusUtsav.dtos.EventResponse;
import com.example.CampusUtsav.dtos.miniDtos.EventSummary;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.security.jwt.JwtUtils;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.EventLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class EventLogController {

    private final EventLogService eventLogService;
    private final JwtUtils jwtUtils;

    @GetMapping("/events/approvals/pending")
    public ResponseEntity<List<EventSummary>> getAllPendingEventsByRole(@AuthenticationPrincipal CustomUserDetails currentUser) throws AccessDeniedException {

        Integer collegeId = currentUser.getCollegeId();
        Role userRole = currentUser.getUser().getRole();
        List<EventSummary> response = eventLogService.getAllPendingEventsByRole(collegeId, userRole, currentUser);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
    @PostMapping("/events/approvals/{eventId}/approve")
    public ResponseEntity<String> approveEventByRole(@PathVariable Integer eventId,
                                                     @RequestBody Map<String,String> request,
                                                     @AuthenticationPrincipal CustomUserDetails currentUser){
        try {
            String response = eventLogService.approveEventByRole(eventId, request.get("remarks"), currentUser);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/events/approvals/{eventId}/revert")
    public ResponseEntity<String> revertEventByRole(@PathVariable Integer eventId,
                                                    @RequestBody Map<String, String> request,
                                                    @AuthenticationPrincipal CustomUserDetails currentUser){
        try {
            String response = eventLogService.revertEventByRole(eventId, request.get("remarks"), currentUser);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/events/{eventId}/logs")
    public ResponseEntity<List<EventLogResponse>> getAllLogsByEventId(@PathVariable Integer eventId,
                                                      @AuthenticationPrincipal CustomUserDetails currentUser) throws AccessDeniedException{

        List<EventLogResponse> response = eventLogService.getAllLogsByEventId(eventId, currentUser);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/events/approvals/reverted")
    public ResponseEntity<List<EventSummary>> getRevertedEventsByClub(@AuthenticationPrincipal CustomUserDetails currentUser) throws AccessDeniedException{

        List<EventSummary> response = eventLogService.getRevertedEventsByClub(currentUser);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    

//    @PostMapping("/approvals/{eventId}/reject")

//    @GetMapping("/events/{eventId}/eventlogs") // -----> This can be in EVENT CONTROLLER
}
