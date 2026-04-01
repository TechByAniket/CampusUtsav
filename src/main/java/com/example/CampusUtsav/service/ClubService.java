package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.ClubRegistrationRequest;
import com.example.CampusUtsav.dtos.ClubResponse;
import com.example.CampusUtsav.dtos.miniDtos.ClubSummary;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.AccessDeniedException;
import java.util.List;

public interface ClubService {
    String registerClub(ClubRegistrationRequest request, Integer collegeId, MultipartFile logoFile);

    List<ClubSummary> getAllClubsByCollege(Integer collegeId);

    String updateClubAccountStatus(Integer clubId,String newStatus,CustomUserDetails currentPrincipal) throws AccessDeniedException;

    List<ClubSummary> getAllClubsForPrincipal(CustomUserDetails currentPrincipal);

    ClubResponse getClubDetailsByClubId(Integer collegeId, Integer clubId);
}
