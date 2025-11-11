package com.example.CampusUtsav.dtos;

import com.example.CampusUtsav.entity.College;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClubResponse {
    private int id;
    private String name;
    private String username;
    private String shortForm;
    private String adminName;
    private String facultyCoordinatorName;
    private String facultyCoordinatorEmail;
    private String adminEmail;
    private String adminPhone;
    private String description;
    private String logoUrl;
    private String websiteUrl;
    private String instagramUrl;
    private String linkedInUrl;
    private boolean emailVerified;
    private boolean phoneVerified;
//    private String verificationCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private CollegeSummaryResponse college;
}