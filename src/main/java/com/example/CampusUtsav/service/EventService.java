package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.EventParticipantsResponse;
import com.example.CampusUtsav.dtos.EventRegistrationsAdminResponse;
import com.example.CampusUtsav.dtos.EventRequest;
import com.example.CampusUtsav.dtos.EventResponse;
import com.example.CampusUtsav.dtos.miniDtos.EventSummary;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.AccessDeniedException;
import java.util.List;

public interface EventService {
    List<String> getAllEventTypes();

    List<String> getAllEventStatuses();

    String createEvent(EventRequest request, MultipartFile file, Integer clubId);

    // ***** FOR EVENTS PAGE ***** //
    List<EventSummary> getAllEventsByCollege(Integer collegeId, CustomUserDetails currentUser) throws AccessDeniedException;

    List<EventSummary> getAllEventsByClub(Integer clubId);

    EventResponse getEventDetailsByEventId(Integer eventId, CustomUserDetails currentUser) throws AccessDeniedException;

    String resubmitEvent(EventRequest request,MultipartFile file,Integer eventId,CustomUserDetails currentClub) throws AccessDeniedException;

    EventParticipantsResponse getEventParticipants(Integer eventId, CustomUserDetails currentUser) throws AccessDeniedException;

    EventRegistrationsAdminResponse getEventRegistrations(Integer eventId, CustomUserDetails currentUser) throws AccessDeniedException;
}
