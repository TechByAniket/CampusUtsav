package com.example.CampusUtsav.mapper;


import com.example.CampusUtsav.dtos.CollegeRegistrationRequest;
import com.example.CampusUtsav.dtos.CollegeResponse;
import com.example.CampusUtsav.entity.College;
import org.springframework.stereotype.Component;

@Component
public class CollegeMapper {
    public College convertToCollegeEntity(CollegeRegistrationRequest req){
        String normalized = req.getName().trim().toLowerCase().replaceAll("\\s+", "");
        return College.builder()
                .name(req.getName())
                .shortForm(req.getShortForm().toUpperCase())
                .normalizedName(normalized)
                .adminName(req.getAdminName())
                .address(req.getAddress())
                .email(req.getEmail())
                .phone(req.getPhone())
                .city(req.getCity())
                .district(req.getDistrict())
                .state(req.getState())
                .websiteUrl(req.getWebsiteUrl())
                .affiliation(req.getAffiliation())
                .passwordHash(req.getPassword())
                .logoUrl(req.getLogoUrl())
                .build();
    }

    public CollegeResponse convertToCollegeResponse(College college){
        return CollegeResponse.builder()
                .id(college.getId())
                .name(college.getName())
                .username(college.getUsername())
                .shortForm(college.getShortForm())
                .normalizedName(college.getNormalizedName())
                .affiliation(college.getAffiliation())
                .adminName(college.getAdminName())
                .email(college.getEmail())
                .phone(college.getPhone())
                .city(college.getCity())
                .district(college.getDistrict())
                .state(college.getState())
                .websiteUrl(college.getWebsiteUrl())
                .logoUrl(college.getLogoUrl())
                .createdAt(college.getCreatedAt())
                .updatedAt(college.getUpdatedAt())
                .emailVerified(college.isEmailVerified())
                .phoneVerified(college.isPhoneVerified()) // for boolean there is not 'get' , but 'is'
                .build();
    }
}
