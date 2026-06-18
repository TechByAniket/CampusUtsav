package com.example.CampusUtsav.dtos;

import com.example.CampusUtsav.dtos.miniDtos.ClubSummary;
import com.example.CampusUtsav.dtos.miniDtos.CollegeSummary;
import com.example.CampusUtsav.entity.enums.AccountStatus;
import com.example.CampusUtsav.entity.enums.Designation;
import com.example.CampusUtsav.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StaffResponse {
    private Integer id;
    private String name;
    private String email;
    private String phone;
    private String employeeId;
    private String branchName;
    private String branchShortForm;
    private Integer branchId;
    private Designation designation;
    private AccountStatus status;
    private boolean isHod;
    private boolean isClubCoordinator;
    private String role;
    private CollegeSummary college;
    private LocalDateTime createdAt;
    private Role userRole;

    private ClubSummary managedClubDetails;
}
