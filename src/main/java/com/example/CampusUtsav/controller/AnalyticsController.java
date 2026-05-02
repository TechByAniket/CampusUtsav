package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.ClubAnalyticsResponse;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    // ----- ONLY FOR HOD AND PRINCIPAL ---- //
    @GetMapping("/clubs/events-count")
    public ResponseEntity<Map<String, Integer>> getEventsCountByClub(@AuthenticationPrincipal CustomUserDetails currentUser){
        Map<String, Integer> response = analyticsService.getEventsCountByClub(currentUser);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/event-categories")
    public ResponseEntity<Map<String, Integer>> getEventsCountByCategory(@AuthenticationPrincipal CustomUserDetails currentUser){
        Map<String, Integer> response = analyticsService.getEventsCountByCategory(currentUser);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/club/overview")
    public ResponseEntity<ClubAnalyticsResponse> getAnalytics(@AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(analyticsService.getAnalytics(currentUser));
    }
}
