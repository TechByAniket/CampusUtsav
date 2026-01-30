package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.LoginRequest;
import com.example.CampusUtsav.dtos.LoginResponse;
import com.example.CampusUtsav.dtos.miniDtos.StudentSummary;
import com.example.CampusUtsav.entity.Club;
import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.entity.Student;
import com.example.CampusUtsav.entity.User;
import com.example.CampusUtsav.mapper.StudentMapper;
import com.example.CampusUtsav.repository.ClubRepository;
import com.example.CampusUtsav.repository.CollegeRepository;
import com.example.CampusUtsav.repository.StudentRepository;
import com.example.CampusUtsav.repository.UserRepository;
import com.example.CampusUtsav.security.jwt.JwtUtils;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.security.service.CustomUserDetailsService;
import com.example.CampusUtsav.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static com.example.CampusUtsav.entity.enums.Role.ROLE_STUDENT;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final CustomUserDetailsService customUserDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ClubRepository clubRepository;
    private final CollegeRepository collegeRepository;
    private final StudentMapper studentMapper;

    @Override
    public LoginResponse login(LoginRequest request) {

        CustomUserDetails user =
                (CustomUserDetails) customUserDetailsService
                        .loadUserByUsername(request.getEmail());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String role = user.getAuthorities()
                .iterator()
                .next()
                .getAuthority();

        String token = jwtUtils.generateJwtToken(user.getUsername(), role);

        Integer collegeId = null;
        StudentSummary studentSummary = null;

        switch (role) {
            case "ROLE_STUDENT" -> {
                Student student = studentRepository
                        .findByUser_Id(user.getId())
                        .orElseThrow(() -> new IllegalStateException("Student not found"));
                collegeId = student.getCollege().getId();

                studentSummary = studentMapper.convertToStudentSummary(student);
            }

            case "ROLE_CLUB" -> {
                Club club = clubRepository
                        .findByUser_Id(user.getId())
                        .orElseThrow(() -> new IllegalStateException("Club not found"));
                collegeId = club.getCollege().getId();
            }

            case "ROLE_COLLEGE" -> {
                College college = collegeRepository
                        .findByUser_Id(user.getId())
                        .orElseThrow(() -> new IllegalStateException("College not found"));
                collegeId = college.getId();
            }
        }
        return new LoginResponse(user.getUsername(), role, token, collegeId, studentSummary);
    }
}
