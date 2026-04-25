package com.example.CampusUtsav.service;

import com.example.CampusUtsav.security.model.CustomUserDetails;

import java.util.HashMap;
import java.util.Map;

public interface AnalyticsService {

    // ---- Events count by each club ---- //
    Map<String, Integer> getEventsCountByClub(CustomUserDetails currentUser);

    // ---- Events count by each category ---- //
    Map<String, Integer> getEventsCountByCategory(CustomUserDetails currentUser);
}
