package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.CollegeRegistrationRequest;
import com.example.CampusUtsav.dtos.CollegeResponse;

public interface CollegeService {
    CollegeResponse registerCollege(CollegeRegistrationRequest req);
}
