package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.CollegeRegistrationRequest;
import com.example.CampusUtsav.dtos.CollegeResponse;
import com.example.CampusUtsav.service.CollegeService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
@RequestMapping("/api/college")
public class CollegeController {

    private final CollegeService collegeService;

    @PostMapping("/register")
    public ResponseEntity<CollegeResponse> registerCollege(@RequestBody CollegeRegistrationRequest req) {
        CollegeResponse dto = collegeService.registerCollege(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }
}
