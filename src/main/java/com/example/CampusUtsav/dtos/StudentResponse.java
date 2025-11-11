package com.example.CampusUtsav.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentResponse {
    private int id;
    private String name;
    private String username;
    private String email;
    private String phone;
    private Integer rollNo;
    private String branch;
    private int year;
    private String division;
    private int admissionYear;
    private int graduationYear;
    private int collegeId;
    private String collegeName;
//    private String profileImageUrl;
    private boolean emailVerified;
    private boolean phoneVerified;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}