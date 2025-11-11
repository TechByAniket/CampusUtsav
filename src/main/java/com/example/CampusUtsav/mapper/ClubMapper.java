package com.example.CampusUtsav.mapper;


import com.example.CampusUtsav.dtos.ClubRegistrationRequest;
import com.example.CampusUtsav.dtos.ClubResponse;
import com.example.CampusUtsav.dtos.CollegeSummaryResponse;
import com.example.CampusUtsav.entity.Club;
import org.springframework.stereotype.Component;

@Component
public class ClubMapper {

    public Club convertToClubEntity(ClubRegistrationRequest req){
        return Club.builder()
                .adminEmail(req.getAdminEmail())
                .adminName(req.getAdminName())
                .adminPhone(req.getAdminPhone())
                .shortForm(req.getShortForm())
//                .college
                .description(req.getDescription())
//                .logoUrl(req.getLogoUrl())
                .linkedInUrl(req.getLinkedInUrl())
                .name(req.getName())
                .instagramUrl(req.getInstagramUrl())
                .facultyCoordinatorName(req.getFacultyCoordinatorName())
                .facultyCoordinatorEmail(req.getFacultyCoordinatorEmail())
                .passwordHash(req.getPassword())
                .websiteUrl(req.getWebsiteUrl())
                .build();
    }

    public ClubResponse convertToClubResponse(Club newClub){
        return ClubResponse.builder()
                .id(newClub.getId())
                .college(CollegeSummaryResponse.builder()
                        .id(newClub.getCollege().getId())
                        .name(newClub.getCollege().getName())
                        .shortForm(newClub.getCollege().getShortForm())
                        .city(newClub.getCollege().getCity())
                        .district(newClub.getCollege().getDistrict())
                        .state(newClub.getCollege().getState())
                        .build())
                .description(newClub.getDescription())
                .username(newClub.getUsername())
                .shortForm(newClub.getShortForm().toUpperCase())
                .adminPhone(newClub.getAdminPhone())
                .adminEmail(newClub.getAdminEmail())
                .adminName(newClub.getAdminName())
                .facultyCoordinatorEmail(newClub.getFacultyCoordinatorEmail())
                .instagramUrl(newClub.getInstagramUrl())
                .linkedInUrl(newClub.getLinkedInUrl())
                .logoUrl(newClub.getLogoUrl())
                .name(newClub.getName())
                .facultyCoordinatorName(newClub.getFacultyCoordinatorName())
                .createdAt(newClub.getCreatedAt())
                .updatedAt(newClub.getUpdatedAt())
                .websiteUrl(newClub.getWebsiteUrl())
                .emailVerified(newClub.isEmailVerified())
                .phoneVerified(newClub.isPhoneVerified())
                .build();
    }
}
