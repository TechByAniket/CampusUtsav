package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.CollegeRegistrationRequest;
import com.example.CampusUtsav.dtos.CollegeResponse;
import com.example.CampusUtsav.dtos.CollegeSummaryResponse;
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
import com.example.CampusUtsav.service.SupabaseService;
import com.example.CampusUtsav.utils.CollegeUtils;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
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
    private final SupabaseService supabaseService;

    @Override
    public CollegeResponse registerCollege(CollegeRegistrationRequest req, MultipartFile file) {

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

        String logoUrl = supabaseService.uploadFile(file);
        if(logoUrl.isEmpty()){
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to upload logo"
            );
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
                .role(Role.ROLE_DEAN)
                .build();
        
        userRepository.save(user);

        newCollege.setUser(user);
        newCollege.setPasswordHash(encodedPassword);
        newCollege.setLogoUrl(logoUrl);

        collegeRepository.save(newCollege);

        return collegeMapper.convertToCollegeResponse(newCollege);
    }

    @Override
    public List<CollegeSummaryResponse> getAllRegisteredColleges(){
        List<College> listOfColleges = collegeRepository.findAll();

        if(listOfColleges.isEmpty()) return Collections.emptyList();

        return listOfColleges.stream()
                .map(collegeMapper :: toCollegeSummaryResponse)
                .toList();
    }
}
