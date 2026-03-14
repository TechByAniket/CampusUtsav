package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.StaffRegistrationRequest;
import com.example.CampusUtsav.dtos.StaffResponse;
import com.example.CampusUtsav.service.StaffService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class StaffController {

    private final StaffService staffService;

    @PostMapping("/staff/register")
    public ResponseEntity<String> registerFaculty(@RequestBody StaffRegistrationRequest request){
        String response = staffService.registerStaff(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/admin/colleges/{collegeId}/staff")
    public ResponseEntity<List<StaffResponse>> getStaffByCollegeId(@PathVariable Integer collegeId){
        List<StaffResponse> response = staffService.getStaffByCollegeId(collegeId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
