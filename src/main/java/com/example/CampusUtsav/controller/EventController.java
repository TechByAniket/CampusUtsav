package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.EventRequest;
import com.example.CampusUtsav.dtos.EventResponse;
import com.example.CampusUtsav.service.EventService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    private final ObjectMapper objectMapper;
//    private final EventService eventService;

    @PostMapping(value = "/new-event", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestPart("event") String eventDetails,
            @RequestPart("file") MultipartFile file
    ) {
        try {
            EventRequest request =
                    objectMapper.readValue(eventDetails, EventRequest.class);

            EventResponse response = eventService.createEvent(request, file);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid JSON Format",
                    e
            );
        }
//        EventResponse response = eventService.createEvent(request, file);
//
//        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/types")
    public ResponseEntity<List<String>> getAllEventTypes(){
        List<String> eventTypes = eventService.getAllEventTypes();

        return ResponseEntity.status(HttpStatus.OK).body(eventTypes);
    }

    @GetMapping("/statuses")
    public ResponseEntity<List<String>> getAllEventStatuses(){
        List<String> eventStatuses = eventService.getAllEventStatuses();

        return ResponseEntity.status(HttpStatus.OK).body(eventStatuses);
    }
}
