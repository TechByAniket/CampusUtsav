package com.example.CampusUtsav.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollegeResponse {
    private int id;
    private String name;
    private String shortForm;
    private String username;
    private String normalizedName;
    private String affiliation;
    private String adminName;
    private String email;
    private String phone;
    private String city;
    private String district;
    private String state;
    private String websiteUrl;
    private String logoUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean emailVerified;
    private boolean phoneVerified;
}
