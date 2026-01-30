package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.ClubRegistrationRequest;
import com.example.CampusUtsav.dtos.ClubResponse;
import com.example.CampusUtsav.dtos.miniDtos.ClubSummary;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ClubService {
    ClubResponse registerClub(ClubRegistrationRequest request, int collegeId, MultipartFile logoFile);

    List<ClubSummary> getAllClubsByCollege(Integer collegeId);

    ClubResponse getClubDetailsByClubId(Integer collegeId, Integer clubId);
}
