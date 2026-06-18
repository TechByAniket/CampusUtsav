package com.example.CampusUtsav.serviceImpl.helper;

import com.example.CampusUtsav.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ValidationHelperService {

     private final EntityLookupService entityLookupService;

     // =======================================
     // CHECK IF EVENT BELONGS TO SPECIFIED CLUB
     // =======================================
     public void validateEventBelongsToClub(Event event, Integer clubId) {
          if (!Objects.equals(event.getClub().getId(), clubId)) {
               throw new AccessDeniedException("Not your club event");
          }
     }

     // =======================================
     // CHECK IF EVENT BELONGS TO SPECIFIED COLLEGE
     // =======================================
     public void validateEventBelongsToSpecifiedCollege(Event event, Integer collegeId) {
          if (!Objects.equals(event.getClub().getCollege().getId(), collegeId)) {
               throw new AccessDeniedException("Not your college event");
          }
     }

     // =======================================
     // CHECK IF FACULTY IS A CLUB COORDINATOR
     // =======================================
     public void validateIsClubCoordinator(Staff faculty) {
          if (!faculty.isClubCoordinator()) {
               throw new IllegalArgumentException(" You are not a coordinator of the specified club");
          }
     }

     // =======================================
     // CHECK IF FACULTY IS A CLUB COORDINATOR OF SPECIFIED CLUB
     // =======================================
     public void validateIsClubCoordinatorOfSpecifiedClub(Staff faculty, Integer clubId) {
          if (!Objects.equals(faculty.getManagedClub().getId(), clubId)) {
               throw new AccessDeniedException("Not your club event");
          }
     }

     // =======================================
     // CHECK IF FACULTY IS A HOD
     // =======================================
     public void validateIsHod(Staff faculty) {
          if (!faculty.isHod()) {
               throw new IllegalArgumentException(" You are not Head Of Department!");
          }
     }

     // =======================================
     // CHECK IF FACULTY IS A HOD OF SPECIFIED BRANCH
     // =======================================
     public void validateIsHodOfSpecifiedBranch(Staff hod, Integer branchId) {
          if (!Objects.equals(hod.getBranch().getId(), branchId)) {
               throw new AccessDeniedException("Not your branch event");
          }
     }

     // =======================================
     // CHECK IF STAFF/FACULTY/HOD BELONGS TO SPECIFIED COLLEGE
     // =======================================
     public void validateStaffBelongsToSpecifiedCollege(Staff staff, Integer collegeId) {
          if (!Objects.equals(staff.getCollege().getId(), collegeId)) {
               throw new AccessDeniedException("Staff does not belong to specified college");
          }
     }

     // =======================================
     // CHECK IF CLUB BELONGS TO SPECIFIED COLLEGE
     // =======================================
     public void validateClubBelongsToSpecifiedCollege(Club club, Integer collegeId){
          if (!Objects.equals(club.getCollege().getId(), collegeId)) {
               throw new ResponseStatusException(
                       HttpStatus.FORBIDDEN,
                       "You are not allowed to access this club as it does not belong to your college."
               );
          }
     }

     // =======================================
     // CHECK IF STUDENT BELONGS TO SPECIFIED COLLEGE
     // =======================================
     public void validateStudentBelongsToSpecifiedCollege(Student student, Integer collegeId) {
          if (!Objects.equals(student.getCollege().getId(), collegeId)) {
               throw new AccessDeniedException("Student does not belong to specified college");
          }
     }

     // =======================================
     // CHECK IF CURRENT STUDENT IS LEADER
     // =======================================
     public boolean validateIsCurrentStudentLeader(Student leader,Integer curStudentId) {
          if (Objects.equals(leader.getId(), curStudentId)) {
               return true;
          } else {
               throw new AccessDeniedException("You are not the team leader");
          }
     }

     // =======================================
     // CHECK IF TEAM MEMBER AND CURRENT USER/STUDENT IS SAME
     public void validateTeamMemberBelongsToCurrentUser(TeamMember teamMember, Integer currentStudentId) {
          if (!Objects.equals(teamMember.getStudent().getId(), currentStudentId)) {
               throw new AccessDeniedException("You are not the team member");
          }
     }

}
