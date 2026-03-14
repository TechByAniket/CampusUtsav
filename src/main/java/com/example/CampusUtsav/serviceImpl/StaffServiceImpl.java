package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.StaffRegistrationRequest;
import com.example.CampusUtsav.dtos.StaffResponse;
import com.example.CampusUtsav.entity.Branch;
import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.entity.Staff;
import com.example.CampusUtsav.entity.User;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.exception.DuplicateResourceException;
import com.example.CampusUtsav.mapper.StaffMapper;
import com.example.CampusUtsav.repository.BranchRepository;
import com.example.CampusUtsav.repository.CollegeRepository;
import com.example.CampusUtsav.repository.StaffRepository;
import com.example.CampusUtsav.service.StaffService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class StaffServiceImpl implements StaffService {

    private final StaffRepository staffRepository;
    private final BranchRepository branchRepository;
    private final StaffMapper staffMapper;
    private final PasswordEncoder passwordEncoder;
    private final CollegeRepository collegeRepository;

    @Override
    @Transactional
    public String registerStaff(StaffRegistrationRequest req){
        // ----- CHECK FOR DUPLICATE EMAIL ----- //
        if(staffRepository.existsByEmail(req.getEmail())){
            throw new DuplicateResourceException("Email already exists, please sign in!");
        }
        if(staffRepository.existsByPhone(req.getPhone())){
            throw new DuplicateResourceException("Phone already exists, please sign in!");
        }
        if(staffRepository.existsByEmployeeId(req.getEmployeeId())){
            throw new DuplicateResourceException("Employee Id already exists, please sign in!");
        }

        College linkedCollege = collegeRepository.findById(req.getCollegeId())
                .orElseThrow(()-> new RuntimeException("College not found!"));

        Branch linkedBranch = branchRepository.findById(req.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found!"));

        Staff newStaff = staffMapper.toStaffEntity(req,linkedBranch, linkedCollege);
        String encodedPassword = passwordEncoder.encode(req.getPassword());
        newStaff.setPasswordHash(encodedPassword);

        User user = User.builder()
                .email(newStaff.getEmail())
                .passwordHash(encodedPassword)
                .role(Role.ROLE_FACULTY)
                .build();

        newStaff.setUser(user);
        staffRepository.save(newStaff);

        return "Faculty registered successfully!";
    }

    @Override
    public List<StaffResponse> getStaffByCollegeId(Integer collegeId){
        if (collegeId == null || collegeId <= 0) {
            throw new IllegalArgumentException("Invalid College ID provided");
        }

        List<Staff> staffList = staffRepository.findAllByCollegeId(collegeId);

        if (staffList == null) {
            return Collections.emptyList();
        }

        return staffList.stream()
                .map(staffMapper :: toStaffResponse)
                .toList();
    }
}
