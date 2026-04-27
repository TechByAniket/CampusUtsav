package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.EventRegistrationRequest;
import com.example.CampusUtsav.dtos.EventRegistrationResponse;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.EventRegistrationService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.core.annotation.AliasFor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class EventRegistrationController {

    private final EventRegistrationService eventRegistrationService;

    @PostMapping("/events/{eventId}/register")
    public ResponseEntity<EventRegistrationResponse> registerForEvent(@PathVariable Integer eventId,
                                                                      @RequestBody EventRegistrationRequest request,
                                                                      @AuthenticationPrincipal CustomUserDetails currentUser){
        EventRegistrationResponse response = eventRegistrationService.registerForEvent(eventId, request, currentUser);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


//    @GetMapping("/colleges/{collegeId}/events/{eventId}/registrations")
//    public ResponseEntity<List<EventRegistrationResponse>> getAllRegistrationsOfEvent(@PathVariable Integer collegeId,
//                                                                                      @PathVariable Integer eventId)
//                                                                                        throws BadRequestException {
//        List<EventRegistrationResponse> response = eventRegistrationService.getAllRegistrationsOfEvent(collegeId, eventId);
//        return ResponseEntity.status(HttpStatus.OK).body(response);
//    }
}
