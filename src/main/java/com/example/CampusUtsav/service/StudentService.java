package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.StudentRegistrationRequest;
import com.example.CampusUtsav.dtos.StudentResponse;
import com.example.CampusUtsav.dtos.miniDtos.StudentSummary;
import com.example.CampusUtsav.security.model.CustomUserDetails;

import java.util.List;

public interface StudentService {
    String registerStudent(StudentRegistrationRequest request);
    List<StudentSummary> getAllStudentsByCollege(Integer collegeId);
    StudentSummary getStudentSummary(String identificationNumber);

    // for profile details
    StudentResponse getMyStudentProfileDetails(CustomUserDetails currentUser);


}
