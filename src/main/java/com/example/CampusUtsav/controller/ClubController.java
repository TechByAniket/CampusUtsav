package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.ClubRegistrationRequest;
import com.example.CampusUtsav.dtos.ClubResponse;
import com.example.CampusUtsav.service.ClubService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class ClubController {

    private final ObjectMapper objectMapper;
    private final ClubService clubService;

//    @PostMapping("/colleges/{collegeId}/clubs/register")
    @PostMapping(value = "/college/{collegeId}/club/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ClubResponse> registerClub(@RequestPart("club") String clubDetails,
                                                     @RequestPart("file") MultipartFile logoFile,
                                                     @PathVariable int collegeId ) {
        try{
            ClubRegistrationRequest request = objectMapper.readValue(clubDetails, ClubRegistrationRequest.class);

            ClubResponse response = clubService.registerClub(request, collegeId, logoFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch(JsonProcessingException e){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid JSON Format",
                    e
            );
        }
    }

    @GetMapping("/colleges/{collegeId}/clubs")
    public ResponseEntity<List<ClubResponse>> getAllClubsByCollege(@PathVariable Integer collegeId){
        List<ClubResponse> response = clubService.getAllClubsByCollege(collegeId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
