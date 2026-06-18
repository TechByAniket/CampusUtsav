package com.example.CampusUtsav.dtos;

import com.example.CampusUtsav.entity.enums.Designation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StaffRegistrationRequest {
    private String name;
    private String email;
    private String phone;
    private String password;
    private String employeeId;
    private Integer collegeId;
    private Integer branchId;
    private Designation designation;
//    private boolean isHod;

    // Optional for now
//    private Integer managedClubId;
}