package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.ClubRegistrationRequest;
import com.example.CampusUtsav.dtos.ClubResponse;
import com.example.CampusUtsav.service.ClubService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class ClubController {

    private final ClubService clubService;

    @PostMapping("/college/{collegeId}/club/register")
    public ResponseEntity<ClubResponse> registerClub(@RequestBody ClubRegistrationRequest request,
                                                     @PathVariable int collegeId ) {
        ClubResponse response = clubService.registerClub(request, collegeId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
