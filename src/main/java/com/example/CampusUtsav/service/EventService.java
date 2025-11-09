package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.EventRequest;
import com.example.CampusUtsav.dtos.EventResponse;

import java.util.List;

public interface EventService {
    List<String> getAllEventTypes();

    List<String> getAllEventStatuses();

    EventResponse createEvent(EventRequest request);
}
