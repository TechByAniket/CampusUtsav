package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.StudentRegistrationRequest;
import com.example.CampusUtsav.dtos.StudentResponse;
import com.example.CampusUtsav.dtos.miniDtos.StudentSummary;
import com.example.CampusUtsav.entity.Branch;
import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.entity.Student;
import com.example.CampusUtsav.entity.User;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.mapper.StudentMapper;
import com.example.CampusUtsav.repository.BranchRepository;
import com.example.CampusUtsav.repository.CollegeRepository;
import com.example.CampusUtsav.repository.StudentRepository;
import com.example.CampusUtsav.repository.UserRepository;
import com.example.CampusUtsav.service.StudentService;
import com.example.CampusUtsav.utils.StudentUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

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


    @Override
    @Transactional
    public StudentResponse registerStudent(StudentRegistrationRequest request) {

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

        return studentMapper.convertToStudentResponse(newStudent);
    }

    // ************* GET ALL STUDENTS OF A COLLEGE ************* //
    @Override
    public List<StudentSummary> getAllStudentsByCollege(Integer collegeId){
        List<Student> studentsList = studentRepository.findByCollege_Id(collegeId)
                .orElseThrow(()-> new EntityNotFoundException("Students not found!"));

        return studentsList.stream()
                .map(studentMapper::convertToStudentSummary)
                .toList();
    }

    // ************* GET SUMMARY DETAILS OF A STUDENT ************* //
    @Override
    public StudentSummary getStudentSummary(String identificationNumber){
        Student curStudent = studentRepository.findByIdentificationNumber(identificationNumber)
                .orElseThrow(() -> new EntityNotFoundException("Student details not found!"));

        return studentMapper.convertToStudentSummary(curStudent);
    }

}
