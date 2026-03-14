package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.StaffRegistrationRequest;
import com.example.CampusUtsav.dtos.StaffResponse;

import java.util.List;

public interface StaffService {
    String registerStaff(StaffRegistrationRequest request);
    List<StaffResponse> getStaffByCollegeId(Integer collegeId);
}
