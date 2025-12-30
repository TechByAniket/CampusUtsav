package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.ClubRegistrationRequest;
import com.example.CampusUtsav.dtos.ClubResponse;
import com.example.CampusUtsav.service.ClubService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class ClubController {

    private final ClubService clubService;

    @PostMapping("/colleges/{collegeId}/clubs/register")
    public ResponseEntity<ClubResponse> registerClub(@RequestBody ClubRegistrationRequest request,
                                                     @PathVariable int collegeId ) {
        ClubResponse response = clubService.registerClub(request, collegeId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/colleges/{collegeId}/clubs")
    public ResponseEntity<List<ClubResponse>> getAllClubsByCollege(@PathVariable Integer collegeId){
        List<ClubResponse> response = clubService.getAllClubsByCollege(collegeId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
