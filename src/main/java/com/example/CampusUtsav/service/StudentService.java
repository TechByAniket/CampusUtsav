package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.StudentRegistrationRequest;
import com.example.CampusUtsav.dtos.StudentResponse;
import com.example.CampusUtsav.dtos.miniDtos.StudentSummary;

import java.util.List;

public interface StudentService {
    StudentResponse registerStudent(StudentRegistrationRequest request);
    List<StudentSummary> getAllStudentsByCollege(Integer collegeId);
    StudentSummary getStudentSummary(String identificationNumber);


}
