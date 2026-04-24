package com.example.CampusUtsav.mapper;

import com.example.CampusUtsav.dtos.StaffRegistrationRequest;
import com.example.CampusUtsav.dtos.StaffResponse;
import com.example.CampusUtsav.dtos.miniDtos.ClubSummary;
import com.example.CampusUtsav.dtos.miniDtos.CollegeSummary;
import com.example.CampusUtsav.entity.Branch;
import com.example.CampusUtsav.entity.Club;
import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.entity.Staff;
import com.example.CampusUtsav.entity.enums.AccountStatus;
import com.example.CampusUtsav.entity.enums.Role;
import org.springframework.stereotype.Component;

@Component
public class StaffMapper {

    public Staff toStaffEntity(StaffRegistrationRequest req, Branch branch, College college){
        return Staff.builder()
                .name(req.getName())
                .phone(req.getPhone())
                .branch(branch)
                .college(college)
                .designation(req.getDesignation())
                .email(req.getEmail())
                .employeeId(req.getEmployeeId())
                .isHod(false)
                .isClubCoordinator(false)
                .status(AccountStatus.ACTIVE) // --- FOR TEMPORARY TESTING PURPOSE --- //
                .build();
    }

    public StaffResponse toStaffResponse(Staff staff){
        Branch linkedBranch = staff.getBranch();
        Club managedClub = staff.getManagedClub();
        String userRole = staff.getUser() != null ? staff.getUser().getRole().name() : "ROLE_FACULTY";

        return StaffResponse.builder()
                .id(staff.getId())
                .name(staff.getName())
                .branchId(linkedBranch != null ? linkedBranch.getId() : null)
                .branchName(linkedBranch != null ? linkedBranch.getName() : null)
                .branchShortForm(linkedBranch != null ?linkedBranch.getShortForm() : null)
                .designation(staff.getDesignation())
                .role(userRole)
                .status(staff.getStatus())
                .isHod(staff.isHod())
                .isClubCoordinator(staff.isClubCoordinator())
                .employeeId(staff.getEmployeeId())
                .email(staff.getEmail())
                .phone(staff.getPhone())
                .managedClubDetails(managedClub != null
                        ?
                        ClubSummary.builder()
                        .name(managedClub.getName())
                        .shortForm(managedClub.getShortForm())
                        .logoUrl(managedClub.getLogoUrl())
                        .adminName(managedClub.getAdminEmail())
                        .id(managedClub.getId())
                        .build()
                        :
                        null)
                .college(CollegeSummary.builder()
                        .id(staff.getCollege().getId())
                        .name(staff.getCollege().getName())
                        .shortForm(staff.getCollege().getShortForm())
                        .city(staff.getCollege().getCity())
                        .district(staff.getCollege().getDistrict())
                        .state(staff.getCollege().getState())
                        .logoUrl(staff.getCollege().getLogoUrl())
                        .build())
                .createdAt(staff.getCreatedAt())
                .userRole(staff.getUser().getRole())
                .build();
    }
}
