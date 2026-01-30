package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.EventRequest;
import com.example.CampusUtsav.dtos.EventResponse;
import com.example.CampusUtsav.dtos.miniDtos.EventSummary;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface EventService {
    List<String> getAllEventTypes();

    List<String> getAllEventStatuses();

    EventResponse createEvent(EventRequest request, MultipartFile file, Integer clubId);

    List<EventSummary> getAllEventsByCollege(String collegeId);

    List<EventSummary> getAllEventsByClub(Integer clubId);
}
