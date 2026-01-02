package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.ClubRegistrationRequest;
import com.example.CampusUtsav.dtos.ClubResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ClubService {
    ClubResponse registerClub(ClubRegistrationRequest request, int collegeId, MultipartFile logoFile);

    List<ClubResponse> getAllClubsByCollege(Integer collegeId);
}
