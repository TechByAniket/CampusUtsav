package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.CollegeRegistrationRequest;
import com.example.CampusUtsav.dtos.CollegeResponse;
import com.example.CampusUtsav.dtos.CollegeSummaryResponse;
import com.example.CampusUtsav.service.CollegeService;
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
public class CollegeController {

    private final CollegeService collegeService;
    private final ObjectMapper objectMapper;

//    @PostMapping("/register")
    @PostMapping(value = "/college/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CollegeResponse> registerCollege(@RequestPart("college") String collegeDetails,
                                                           @RequestPart("file")MultipartFile file) {
        try{
            CollegeRegistrationRequest request = objectMapper.readValue(collegeDetails, CollegeRegistrationRequest.class);
            CollegeResponse response = collegeService.registerCollege(request, file);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch(JsonProcessingException e){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid JSON Format",
                    e
            );
        }
    }

    @GetMapping("/public/colleges")
    public ResponseEntity<List<CollegeSummaryResponse>> getAllRegisteredColleges(){
        List<CollegeSummaryResponse> response = collegeService.getAllRegisteredColleges();
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
