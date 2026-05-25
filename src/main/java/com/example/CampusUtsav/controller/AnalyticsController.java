package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.ClubAnalyticsResponse;
import com.example.CampusUtsav.dtos.EventAnalyticsResponse;
import com.example.CampusUtsav.dtos.TopPerformingEventResponse;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    // ----- EVENT-SPECIFIC ANALYTICS ---- //
    @GetMapping("/event/{eventId}")
    public ResponseEntity<EventAnalyticsResponse> getEventAnalytics(
            @PathVariable Integer eventId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        EventAnalyticsResponse response = analyticsService.getEventAnalytics(eventId, currentUser);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/events/top-performing-events")
    public ResponseEntity<List<TopPerformingEventResponse>> getTopPerformingEvents(@RequestParam(defaultValue = "5") Integer limit,
                                                                                   @AuthenticationPrincipal CustomUserDetails currentUser
    ){
        List<TopPerformingEventResponse> response = analyticsService.getTopPerformingEvents(limit, currentUser);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
