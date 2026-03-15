package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.CollegeRegistrationRequest;
import com.example.CampusUtsav.dtos.CollegeResponse;
import com.example.CampusUtsav.dtos.CollegeSummaryResponse;
import jakarta.mail.Multipart;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CollegeService {
    CollegeResponse registerCollege(CollegeRegistrationRequest req, MultipartFile file);
    List<CollegeSummaryResponse> getAllRegisteredColleges();
}
