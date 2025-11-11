package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.StudentRegistrationRequest;
import com.example.CampusUtsav.dtos.StudentResponse;
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
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
    public StudentResponse registerStudent(StudentRegistrationRequest request) {

        if (request.getGraduationYear() <= request.getAdmissionYear()) {
            throw new IllegalArgumentException("Graduation year must be after admission year");
        }

        College linkedCollege = collegeRepository.findById(request.getCollegeId())
                .orElseThrow(()-> new EntityNotFoundException("College Not Found!"));

        Branch linkedBranch = branchRepository.findById(request.getBranchId())
                .orElseThrow(()-> new EntityNotFoundException("Branch Not Found!"));

        Student newStudent = studentMapper.convertToStudentEntity(request, linkedCollege, linkedBranch);
        newStudent.setUsername(studentUtils.generateStudentUsername(request, linkedCollege, linkedBranch));

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        newStudent = studentRepository.save(newStudent);
        newStudent.setPasswordHash(encodedPassword);

        User user = User.builder()
                .email(newStudent.getEmail())
                .passwordHash(encodedPassword)
                .role(Role.ROLE_STUDENT)
                .build();

        userRepository.save(user);

        // Linking with corresponding entity
        newStudent.setUser(user);

        return studentMapper.convertToStudentResponse(newStudent);
    }
}
