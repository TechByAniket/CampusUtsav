package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.StudentRegistrationRequest;
import com.example.CampusUtsav.dtos.StudentResponse;

public interface StudentService {
    StudentResponse registerStudent(StudentRegistrationRequest request);
}
