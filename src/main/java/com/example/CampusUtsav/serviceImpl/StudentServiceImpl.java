package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.StudentRegistrationRequest;
import com.example.CampusUtsav.dtos.StudentRegistrationsResponse;
import com.example.CampusUtsav.dtos.StudentResponse;
import com.example.CampusUtsav.dtos.miniDtos.StudentSummary;
import com.example.CampusUtsav.entity.*;
import com.example.CampusUtsav.entity.enums.NotificationType;
import com.example.CampusUtsav.entity.enums.RegistrationStatus;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.entity.enums.TeamMemberStatus;
import com.example.CampusUtsav.mapper.StudentMapper;
import com.example.CampusUtsav.mapper.StudentRegistrationsMapper;
import com.example.CampusUtsav.repository.*;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.NotificationService;
import com.example.CampusUtsav.service.StudentService;
import com.example.CampusUtsav.utils.StudentUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.ObjectStreamClass;
import java.nio.file.AccessDeniedException;
import java.util.*;

@Service
@AllArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final CollegeRepository collegeRepository;
    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;
    private final BranchRepository branchRepository;
    private final StudentUtils studentUtils;
    private final PasswordEncoder passwordEncoder;
//    private final Role role;
    private final UserRepository userRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final EventAttendanceRepository eventAttendanceRepository;
    private final StudentRegistrationsMapper studentRegistrationsMapper;
    private final NotificationService notificationService;


    @Override
    @Transactional
    public String registerStudent(StudentRegistrationRequest request) {

        if (request.getGraduationYear() <= request.getAdmissionYear()) {
            throw new IllegalArgumentException("Graduation year must be after admission year");
        }

        College linkedCollege = collegeRepository.findById(request.getCollegeId())
                .orElseThrow(() -> new EntityNotFoundException("College Not Found!"));

        Branch linkedBranch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new EntityNotFoundException("Branch Not Found!"));

        Student newStudent = studentMapper.convertToStudentEntity(
                request, linkedCollege, linkedBranch
        );

        newStudent.setUsername(
                studentUtils.generateStudentUsername(request, linkedCollege, linkedBranch)
        );

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        newStudent.setPasswordHash(encodedPassword);

        User user = User.builder()
                .email(newStudent.getEmail())
                .passwordHash(encodedPassword)
                .role(Role.ROLE_STUDENT)
                .build();

        // Link BEFORE save
        newStudent.setUser(user);
        studentRepository.save(newStudent);

        // ==========================================
        // ACCOUNT CREATION CONFIRMATION NOTIFICATION FOR STUDENT
        // ==========================================

        notificationService.createNotification(
                newStudent.getUser(),
                "Account Created Successfully",
                "Dear " + newStudent.getName() + ", your CampusUtsav account is ready. "
                        + "Log in to explore events and stay updated with campus activities.",
                NotificationType.ACCOUNT_CREATION,
                "/explore-events"
        );

        return "Student registration successful!";
    }

    // ************* GET ALL STUDENTS OF A COLLEGE ************* //
    @Override
    public List<StudentSummary> getAllStudentsByCollege(CustomUserDetails currentUser, Integer collegeId) throws AccessDeniedException {
        if(currentUser == null) throw new RuntimeException("Unauthorised! You aren't logged in!");

        if(!Objects.equals(currentUser.getCollegeId(), collegeId)){
            throw new AccessDeniedException("Unauthorized! You cannot view other college's students");
        }

        List<Student> studentsList = studentRepository.findByCollege_Id(collegeId)
                .orElseThrow(()-> new EntityNotFoundException("Students not found!"));

        return studentsList.stream()
                .map(studentMapper::convertToStudentSummary)
                .toList();
    }

    // ************* GET SUMMARY DETAILS OF A STUDENT ************* //
    @Override
    public StudentSummary getStudentSummary(String identificationNumber){

        Student curStudent = studentRepository.findByIdentificationNumber(identificationNumber.trim().toUpperCase())
                .orElseThrow(() -> new EntityNotFoundException("Student details not found!"));

        return studentMapper.convertToStudentSummary(curStudent);
    }

    // ************* GET PROFILE DETAILS OF A STUDENT *********** //
    @Override
    public StudentResponse getMyStudentProfileDetails(CustomUserDetails currentUser){
        if (currentUser == null || currentUser.getUser() == null) {
            throw new RuntimeException("Unauthorized access!");
        }

        Role userRole = currentUser.getUser().getRole();
        if(userRole == Role.ROLE_STUDENT) {
            Student curStudent = studentRepository.findById(currentUser.getProfileId())
                    .orElseThrow(() -> new RuntimeException("Student not found!"));

            return studentMapper.convertToStudentResponse(curStudent);
        }
        throw new RuntimeException("Access Denied: Logged in user is not a STUDENT!");
    }

    @Override
    public List<StudentRegistrationsResponse> getStudentRegistrations(CustomUserDetails currentUser) {

        Integer studentId = currentUser.getProfileId();

        // =========================
        // Result list (final response container)
        // =========================
        List<StudentRegistrationsResponse> result = new ArrayList<>();

        // =========================
        // Fetch INDIVIDUAL registrations
        // =========================
        List<EventRegistration> individualRegs =
                eventRegistrationRepository.findByStudent_IdAndStatus(
                        studentId,
                        RegistrationStatus.REGISTERED
                );

        // Convert each individual registration into DTO
        for (EventRegistration reg : individualRegs) {

            result.add(
                    studentRegistrationsMapper.toStudentRegistrationsResponse(
                            reg.getEvent(),      // event details
                            "INDIVIDUAL",        // type
                            null                 // no team
                    )
            );
        }

        // =========================
        // Fetch TEAM registrations
        // =========================
        List<TeamMember> teamRegs =
                teamMemberRepository.findByStudent_IdAndStatus(
                        studentId,
                        TeamMemberStatus.ACTIVE
                );

        for (TeamMember teamMember : teamRegs) {

            Event event = teamMember.getEvent();

            // =========================
            // Avoid duplicate events
            // =========================
            boolean alreadyAdded = result.stream()
                    .anyMatch(r -> r.getEventId().equals(event.getId()));

            if (!alreadyAdded) {

                result.add(
                        studentRegistrationsMapper.toStudentRegistrationsResponse(
                                event,              // event details
                                "TEAM",             // type
                                teamMember          // team info
                        )
                );
            }
        }

        // =========================
        // Extract all event IDs
        // (For batch attendance query)
        // =========================
        List<Integer> eventIds = result.stream()
                .map(StudentRegistrationsResponse::getEventId)
                .toList();


        // =========================
        // Fetch attendance in ONE query
        // =========================
        if (!eventIds.isEmpty()) {

            List<EventAttendance> attendanceList =
                    eventAttendanceRepository.findByStudent_IdAndEvent_IdIn(studentId, eventIds);

            // =========================
            // Build map for fast lookup
            // eventId -> attendance record
            // =========================
            Map<Integer, EventAttendance> attendanceMap = new HashMap<>();

            for (EventAttendance att : attendanceList) {
                attendanceMap.put(att.getEvent().getId(), att);
            }


            // =========================
            // Apply attendance to each DTO
            // =========================
            for (StudentRegistrationsResponse dto : result) {

                EventAttendance att = attendanceMap.get(dto.getEventId());

                // If attendance exists -> mark present
                // Otherwise it's already marked absent above
                if (att != null) {
                    dto.setAttendanceMarked(true);
                    dto.setMarkedAt(att.getMarkedAt());
                }
            }
        }
        return result;
    }

}
