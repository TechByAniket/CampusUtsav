package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.ClubRegistrationRequest;
import com.example.CampusUtsav.dtos.ClubResponse;
import com.example.CampusUtsav.dtos.StaffResponse;
import com.example.CampusUtsav.dtos.miniDtos.ClubSummary;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.ClubService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class ClubController {

    private final ObjectMapper objectMapper;
    private final ClubService clubService;

//    @PostMapping("/colleges/{collegeId}/clubs/register")
    @PostMapping(value = "/public/college/{collegeId}/club/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> registerClub(@RequestPart("club") String clubDetails,
                                                     @RequestPart("file") MultipartFile logoFile,
                                                     @PathVariable Integer collegeId ) {
        try{
            ClubRegistrationRequest request = objectMapper.readValue(clubDetails, ClubRegistrationRequest.class);

            String response = clubService.registerClub(request, collegeId, logoFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch(JsonProcessingException e){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid JSON Format",
                    e
            );
        }
    }

    @GetMapping("/public/colleges/{collegeId}/clubs")
    public ResponseEntity<List<ClubSummary>> getAllClubsByCollege(@PathVariable Integer collegeId){
        List<ClubSummary> response = clubService.getAllClubsByCollege(collegeId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/colleges/{collegeId}/clubs/{clubId}")
    public ResponseEntity<ClubResponse> getClubDetailsByClubId(@PathVariable Integer collegeId,
                                                               @PathVariable Integer clubId){
        ClubResponse response = clubService.getClubDetailsByClubId(collegeId, clubId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/admin/clubs")
    public ResponseEntity<List<ClubSummary>> getStaffByCollegeId(@AuthenticationPrincipal CustomUserDetails currentPrincipal){

        List<ClubSummary> response = clubService.getAllClubsForPrincipal(currentPrincipal);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PatchMapping("/admin/clubs/{clubId}/status")
    public ResponseEntity<String> updateClubAccountStatus(@PathVariable Integer clubId,
                                                      @RequestBody Map<String, String> request,
                                                      @AuthenticationPrincipal CustomUserDetails currentPrincipal) throws AccessDeniedException {
        String newStatus = request.get("status");
        String response = clubService.updateClubAccountStatus(clubId, newStatus, currentPrincipal);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
