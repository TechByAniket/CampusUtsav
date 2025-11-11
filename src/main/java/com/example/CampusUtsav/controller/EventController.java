package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.EventRequest;
import com.example.CampusUtsav.dtos.EventResponse;
import com.example.CampusUtsav.service.EventService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    @PostMapping("/new-event")
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventRequest request){
        EventResponse response = eventService.createEvent(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
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
