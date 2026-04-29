package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.AttendanceTokenResponse;
import com.example.CampusUtsav.dtos.EventAttendanceResponse;
import com.example.CampusUtsav.dtos.EventAttendanceStatusResponse;
import com.example.CampusUtsav.mapper.EventAttendanceMapper;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.EventAttendanceService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class EventAttendanceController {

    private final EventAttendanceService eventAttendanceService;

    @PostMapping("/events/{eventId}/attendance/scan")
    public ResponseEntity<String> markAttendance(@PathVariable Integer eventId,
                                                 @RequestBody Map<String, String> body,
                                                 @AuthenticationPrincipal CustomUserDetails currentUser ){

        String attendanceToken = body.get("attendanceToken");
        String response = eventAttendanceService.markAttendance(eventId, attendanceToken, currentUser);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/events/{eventId}/attendance/start")
    public ResponseEntity<String> startAttendance(@PathVariable Integer eventId,
                                                  @AuthenticationPrincipal CustomUserDetails currentUser) {

        String response = eventAttendanceService.startAttendance(eventId, currentUser);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/events/{eventId}/attendance/stop")
    public ResponseEntity<String> stopAttendance(@PathVariable Integer eventId,
                                                 @AuthenticationPrincipal CustomUserDetails currentUser) {

        String response = eventAttendanceService.stopAttendance(eventId, currentUser);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/events/{eventId}/attendance")
    public ResponseEntity<EventAttendanceResponse> getEventAttendance(@PathVariable Integer eventId,
                                                                      @AuthenticationPrincipal CustomUserDetails currentUser){
        EventAttendanceResponse response = eventAttendanceService.getEventAttendance(eventId, currentUser);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/events/{eventId}/attendance/status")
    public ResponseEntity<EventAttendanceStatusResponse> getEventAttendanceStatus(@PathVariable Integer eventId,
                                                                                  @AuthenticationPrincipal CustomUserDetails currentUser){
        EventAttendanceStatusResponse response = eventAttendanceService.getEventAttendanceStatus(eventId, currentUser);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/events/{eventId}/attendance/token")
    public ResponseEntity<AttendanceTokenResponse> getAttendanceToken(@PathVariable Integer eventId,
                                                                      @AuthenticationPrincipal CustomUserDetails currentUser) {
        AttendanceTokenResponse response = eventAttendanceService.getAttendanceToken(eventId, currentUser);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
