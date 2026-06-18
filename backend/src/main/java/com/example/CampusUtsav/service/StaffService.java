package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.StaffRegistrationRequest;
import com.example.CampusUtsav.dtos.StaffResponse;
import com.example.CampusUtsav.security.model.CustomUserDetails;

import java.util.List;

public interface StaffService {
    String registerStaff(StaffRegistrationRequest request);
    List<StaffResponse> getStaffByCollegeId(Integer collegeId);

    void updateStaffAccountStatus(Integer staffId, String newStatus, Integer collegeId);
    void updateStaffRole(Integer staffId, String newRole, Integer collegeId);
    void updateStaffClubAssignment(Integer staffId, Integer clubId, Integer collegeId);

    StaffResponse getMyStaffProfileDetails(CustomUserDetails currentUser);
}
