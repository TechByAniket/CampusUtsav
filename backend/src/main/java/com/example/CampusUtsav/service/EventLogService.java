package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.EventLogResponse;
import com.example.CampusUtsav.dtos.EventResponse;
import com.example.CampusUtsav.dtos.miniDtos.EventSummary;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.security.model.CustomUserDetails;

import java.nio.file.AccessDeniedException;
import java.util.List;

public interface EventLogService {
    List<EventSummary> getAllPendingEventsByRole(Integer collegeId, Role userRole, CustomUserDetails currentUser) throws AccessDeniedException;
    String approveEventByRole(Integer eventId, String remarks,CustomUserDetails currentUser) throws AccessDeniedException;
    String revertEventByRole(Integer eventId, String remarks,CustomUserDetails currentUser) throws AccessDeniedException;
    List<EventSummary> getRevertedEventsByClub(CustomUserDetails currentUser) throws AccessDeniedException;

    List<EventLogResponse> getAllLogsByEventId(Integer eventId, CustomUserDetails currentUser) throws AccessDeniedException;
}
