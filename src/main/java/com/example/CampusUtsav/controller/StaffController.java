package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.StaffRegistrationRequest;
import com.example.CampusUtsav.dtos.StaffResponse;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.StaffService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class StaffController {

    private final StaffService staffService;

    @PostMapping("/public/staff/register")
    public ResponseEntity<String> registerFaculty(@RequestBody StaffRegistrationRequest request){
        String response = staffService.registerStaff(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/admin/staff")
    public ResponseEntity<List<StaffResponse>> getStaffByCollegeId(@AuthenticationPrincipal CustomUserDetails currentUser){
        Integer collegeId = currentUser.getCollegeId();
        List<StaffResponse> response = staffService.getStaffByCollegeId(collegeId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PatchMapping("/admin/staff/{staffId}/status")
    public ResponseEntity<?> updateStaffAccountStatus(@PathVariable Integer staffId,
                                          @RequestBody Map<String, String> request,
                                          @AuthenticationPrincipal CustomUserDetails currentDean) {
        Integer collegeId = currentDean.getCollegeId();
        String newStatus = request.get("status");
        staffService.updateStaffAccountStatus(staffId, newStatus, collegeId);
        return ResponseEntity.ok("Status Updated");
    }

    @PatchMapping("/admin/staff/{staffId}/role")
    public ResponseEntity<?> updateStaffRole(@PathVariable Integer staffId,
                                        @RequestBody Map<String, String> request,
                                        @AuthenticationPrincipal CustomUserDetails currentDean) {
        Integer collegeId = currentDean.getCollegeId();
        String newRole = request.get("role");
        staffService.updateStaffRole(staffId, newRole, collegeId);
        return ResponseEntity.ok("Role Updated");
    }

    @PatchMapping("/admin/staff/{staffId}/club")
    public ResponseEntity<?> updateStaffClubAssignment(@PathVariable Integer staffId,
                                                       @RequestBody Map<String, Object> request, // OBJECT because it can be null , when dean selects 'NOT ASSIGNED' .
                                                       @AuthenticationPrincipal CustomUserDetails currentDean){
        Integer collegeId = currentDean.getCollegeId();
        Object clubIdObj = request.get("clubId");
        Integer clubId = (clubIdObj != null && !clubIdObj.toString().equals("NONE"))
                ? Integer.parseInt(clubIdObj.toString())
                : null;

        staffService.updateStaffClubAssignment(staffId, clubId, collegeId);
        return ResponseEntity.status(HttpStatus.OK).body("Club Assignment Updated");

    }
}
