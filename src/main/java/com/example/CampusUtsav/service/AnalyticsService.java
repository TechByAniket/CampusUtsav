package com.example.CampusUtsav.service;

import com.example.CampusUtsav.security.model.CustomUserDetails;

import java.util.HashMap;
import java.util.Map;

public interface AnalyticsService {

    Map<String, Integer> getEventsCountByClub(CustomUserDetails currentUser);
}
