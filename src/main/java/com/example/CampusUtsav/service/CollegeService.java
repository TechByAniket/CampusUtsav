package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.CollegeRegistrationRequest;
import com.example.CampusUtsav.dtos.CollegeResponse;
import jakarta.mail.Multipart;
import org.springframework.web.multipart.MultipartFile;

public interface CollegeService {
    CollegeResponse registerCollege(CollegeRegistrationRequest req, MultipartFile file);
}
