package com.example.CampusUtsav.dtos;

import com.example.CampusUtsav.dtos.miniDtos.ClubSummary;
import com.example.CampusUtsav.entity.enums.AccountStatus;
import com.example.CampusUtsav.entity.enums.Designation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String role;
    private Integer collegeId;
    private ClubSummary managedClubDetails;
}
