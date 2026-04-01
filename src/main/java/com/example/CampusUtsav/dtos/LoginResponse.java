package com.example.CampusUtsav.dtos;

import com.example.CampusUtsav.dtos.miniDtos.StudentSummary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponse {

    private String email;
    private String role;
    private String token;
    private Integer collegeId;

    // for students only:
    private StudentSummary studentSummary;
    private Integer profileId;
}
