package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.AttendanceTokenResponse;
import com.example.CampusUtsav.dtos.EventAttendanceResponse;
import com.example.CampusUtsav.security.model.CustomUserDetails;

public interface EventAttendanceService {

    String markAttendance(Integer eventId, String token, CustomUserDetails customUserDetails);

    String startAttendance(Integer eventId, CustomUserDetails currentUser);

    EventAttendanceResponse getEventAttendance(Integer eventId, CustomUserDetails currentUser);

    AttendanceTokenResponse getAttendanceToken(Integer eventId, CustomUserDetails currentUser);

    String stopAttendance(Integer eventId, CustomUserDetails currentUser);
}
