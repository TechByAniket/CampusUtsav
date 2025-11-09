package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.ClubRegistrationRequest;
import com.example.CampusUtsav.dtos.ClubResponse;

import java.util.List;

public interface ClubService {
    ClubResponse registerClub(ClubRegistrationRequest request, int collegeId);

    List<ClubResponse> getAllClubsByCollege(int collegeId);
}
