package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.ClubRegistrationRequest;
import com.example.CampusUtsav.dtos.ClubResponse;

public interface ClubService {
    ClubResponse registerClub(ClubRegistrationRequest request, int collegeId);
}
