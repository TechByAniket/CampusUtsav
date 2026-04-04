package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.CollegeResponse;
import com.example.CampusUtsav.dtos.StudentRegistrationRequest;
import com.example.CampusUtsav.dtos.StudentResponse;
import com.example.CampusUtsav.dtos.miniDtos.StudentSummary;
import com.example.CampusUtsav.repository.CollegeRepository;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.StudentService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class StudentController {

    private final StudentService studentService;

    @PostMapping("/student/register")
    public ResponseEntity<String> registerStudent(@Valid @RequestBody StudentRegistrationRequest request){
        String response = studentService.registerStudent(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/colleges/{collegeId}/students")
    ResponseEntity<List<StudentSummary>> getAllStudentsByCollege(@PathVariable Integer collegeId){
        List<StudentSummary> response = studentService.getAllStudentsByCollege(collegeId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/student/{identificationNumber}")
    public ResponseEntity<StudentSummary> getStudentSummary(@PathVariable String identificationNumber){
        StudentSummary response = studentService.getStudentSummary(identificationNumber);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/students/me")
    public ResponseEntity<StudentResponse> getMyStudentProfileDetails(@AuthenticationPrincipal CustomUserDetails currentUser){
        StudentResponse response = studentService.getMyStudentProfileDetails(currentUser);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

}
