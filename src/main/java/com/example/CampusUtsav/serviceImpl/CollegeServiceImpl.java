package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.CollegeRegistrationRequest;
import com.example.CampusUtsav.dtos.CollegeResponse;
import com.example.CampusUtsav.entity.Branch;
import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.entity.User;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.mapper.BranchMapper;
import com.example.CampusUtsav.mapper.CollegeMapper;
import com.example.CampusUtsav.repository.BranchRepository;
import com.example.CampusUtsav.repository.CollegeRepository;
import com.example.CampusUtsav.repository.UserRepository;
import com.example.CampusUtsav.service.CollegeService;
import com.example.CampusUtsav.utils.CollegeUtils;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
//@RequiredArgsConstructor
@AllArgsConstructor
public class CollegeServiceImpl implements CollegeService {

    private final CollegeRepository collegeRepository;
    private final CollegeMapper collegeMapper;
    private final BranchMapper branchMapper;
    private final BranchRepository branchRepository;
    private final CollegeUtils collegeUtils;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Override
    public CollegeResponse registerCollege(CollegeRegistrationRequest req) {

        String normalized = req.getName().trim().toLowerCase().replaceAll("\\s+", "");

        if (collegeRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        if (collegeRepository.existsByPhone(req.getPhone())) {
            throw new IllegalArgumentException("Phone number already registered");
        }

        if ((collegeRepository.existsByNameIgnoreCase(req.getName())) || (collegeRepository.existsByNormalizedName(normalized))) {
            throw new IllegalArgumentException("College already registered");
        }

        College newCollege = collegeMapper.convertToCollegeEntity(req);
        String generatedUsername = collegeUtils.generateCollegeUsername(newCollege.getShortForm(), newCollege.getCity(), newCollege.getDistrict());
        newCollege.setUsername(generatedUsername);

        List<Branch> branchEntities = req.getBranches().stream()
                .map(branchName -> branchRepository.findByNameIgnoreCase(branchName)
                        .orElseGet(() -> branchRepository.save(branchMapper.convertToBranchEntity(branchName))))
                .collect(Collectors.toList());

        newCollege.setBranches(branchEntities);

        String encodedPassword = passwordEncoder.encode(req.getPassword());
        User user = User.builder()
                .email(newCollege.getEmail())
                .passwordHash(encodedPassword)
                .role(Role.ROLE_COLLEGE)
                .build();

        userRepository.save(user);

        // Linking with corresponding entity
        newCollege.setUser(user);

        newCollege = collegeRepository.save(newCollege);
        newCollege.setPasswordHash(encodedPassword);

        return collegeMapper.convertToCollegeResponse(newCollege);
    }
}
