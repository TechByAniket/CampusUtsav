package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.AiPromptRequest;
import com.example.CampusUtsav.dtos.EventRequest;
import com.example.CampusUtsav.dtos.EventResponse;
import com.example.CampusUtsav.dtos.miniDtos.EventSummary;
import com.example.CampusUtsav.entity.enums.EventCategory;
import com.example.CampusUtsav.entity.enums.EventType;
import com.example.CampusUtsav.ai.AiService;
import com.example.CampusUtsav.security.jwt.JwtUtils;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.EventService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.AccessDeniedException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class EventController {

    private final EventService eventService;
    private final ObjectMapper objectMapper;
    private final AiService aiService;
    private final JwtUtils jwtUtils;
//    private final EventService eventService;

    @PostMapping(value = "/events/{clubId}/new-event", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createEvent(
            @Valid @RequestPart("event") String eventDetails,
            @RequestPart("file") MultipartFile file,
            @PathVariable Integer clubId
    ) {
        try {
            EventRequest request =
                    objectMapper.readValue(eventDetails, EventRequest.class);

            String response = eventService.createEvent(request, file, clubId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid JSON Format",
                    e
            );
        }
    }

    @PutMapping(value = "/events/{eventId}/resubmit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> resubmitEvent(
            @Valid @RequestPart("event") String eventDetails,
            @RequestPart("file") MultipartFile file,
            @PathVariable Integer eventId,
            @AuthenticationPrincipal CustomUserDetails currentClub
    ) throws AccessDeniedException {
        try {
            EventRequest request =
                    objectMapper.readValue(eventDetails, EventRequest.class);

            String response = eventService.resubmitEvent(request, file, eventId, currentClub);
            return ResponseEntity.status(HttpStatus.OK).body(response);

        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid JSON Format",
                    e
            );
        }
    }

//    @GetMapping("/types")
//    public ResponseEntity<List<String>> getAllEventTypes(){
//        List<String> eventTypes = eventService.getAllEventTypes();
//
//        return ResponseEntity.status(HttpStatus.OK).body(eventTypes);
//    }

    @PostMapping("/events/ai/generate")
    public ResponseEntity<Map<String, String>> generate(@RequestBody AiPromptRequest userPrompt) {
        String markdownResponse = aiService.generateResponse(userPrompt);
        return ResponseEntity.ok(Map.of("generatedText", markdownResponse));
    }

    @GetMapping("/colleges/{collegeId}/events")
    public ResponseEntity<List<EventSummary>> getAllEventsByCollege(@PathVariable Integer collegeId,
                                                                    @AuthenticationPrincipal CustomUserDetails currentPrincipal)throws AccessDeniedException{
        List<EventSummary> response = eventService.getAllEventsByCollege(collegeId, currentPrincipal);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // PRIVATE ENDPOINT - WE HAVE TO MAKE A PUBLIC ENDPOINT AS WELL FOR EVENTSTATUS == APPROVED THAT WILL BE OPEN FOR ALL WITHOUT LOGIN //
    @GetMapping("/events/{eventId}")
    public ResponseEntity<EventResponse> getEventDetailsByEventId(@PathVariable Integer eventId,
                                                                  @AuthenticationPrincipal CustomUserDetails currentUser) throws AccessDeniedException {
        EventResponse response = eventService.getEventDetailsByEventId(eventId, currentUser);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/clubs/{clubId}/events")
    public ResponseEntity<List<EventSummary>> getALlEventsByClub(@PathVariable Integer clubId,
                                                                 @AuthenticationPrincipal CustomUserDetails currentUser){

//        if (currentUser.getRole().contains("ROLE_CLUB")) {
//            if (!currentUser.getProfileId().equals(clubId)) {
//                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
//            }
//        }

        List<EventSummary> response = eventService.getAllEventsByClub(clubId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

//    ---------------------------------
    // ----- PUT	/api/events/{id}	Update Event details (Only if DRAFT or REVERTED) ----------------------
//    ---------------------------------

    @GetMapping("/events/categories-types")
    public Map<EventCategory, List<EventType>> getEventCategoriesAndTypes() {
        return Arrays.stream(EventType.values())
                .collect(Collectors.groupingBy(EventType::getCategory));
    }

    @GetMapping("/events/statuses")
    public ResponseEntity<List<String>> getAllEventStatuses(){
        List<String> eventStatuses = eventService.getAllEventStatuses();

        return ResponseEntity.status(HttpStatus.OK).body(eventStatuses);
    }
}
