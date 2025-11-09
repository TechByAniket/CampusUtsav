package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.EventRegistrationRequest;
import com.example.CampusUtsav.dtos.EventRegistrationResponse;
import com.example.CampusUtsav.service.EventRegistrationService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.core.annotation.AliasFor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class EventRegistrationController {

    private final EventRegistrationService eventRegistrationService;

    @PostMapping("/register/{eventId}")
    public ResponseEntity<EventRegistrationResponse> registerForEvent(@Valid @PathVariable Integer eventId,
                                                                      @RequestBody EventRegistrationRequest request) throws BadRequestException {
        EventRegistrationResponse response = eventRegistrationService.registerForEvent(eventId, request);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
