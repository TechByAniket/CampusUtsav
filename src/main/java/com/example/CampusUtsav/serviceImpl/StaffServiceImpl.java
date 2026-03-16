package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.StaffRegistrationRequest;
import com.example.CampusUtsav.dtos.StaffResponse;
import com.example.CampusUtsav.entity.*;
import com.example.CampusUtsav.entity.enums.AccountStatus;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.exception.DuplicateResourceException;
import com.example.CampusUtsav.mapper.StaffMapper;
import com.example.CampusUtsav.repository.*;
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
    private final UserRepository userRepository;
    private final ClubRepository clubRepository;

    @Override
    @Transactional
    public String registerStaff(StaffRegistrationRequest req) {

        College linkedCollege = collegeRepository.findById(req.getCollegeId())
                .orElseThrow(() -> new RuntimeException("College not found!"));

        // ----- CHECK FOR DUPLICATE EMAIL ----- //
        if (staffRepository.existsByEmail(req.getEmail())) {
            throw new DuplicateResourceException("Email already exists, please sign in!");
        }
        if (staffRepository.existsByPhone(req.getPhone())) {
            throw new DuplicateResourceException("Phone already exists, please sign in!");
        }
        if (staffRepository.existsByEmployeeId(req.getEmployeeId())) {
            throw new DuplicateResourceException("Employee Id already exists, please sign in!");
        }

        Branch linkedBranch = branchRepository.findById(req.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found!"));

        Staff newStaff = staffMapper.toStaffEntity(req, linkedBranch, linkedCollege);
        String encodedPassword = passwordEncoder.encode(req.getPassword());
        newStaff.setPasswordHash(encodedPassword);

        User user = User.builder()
                .email(newStaff.getEmail())
                .passwordHash(encodedPassword)
                .role(Role.ROLE_FACULTY)
                .build();

        newStaff.setUser(user);
        staffRepository.save(newStaff);

        return "Staff registered successfully!";
    }

    @Override
    public List<StaffResponse> getStaffByCollegeId(Integer collegeId) {
        if (collegeId == null || collegeId <= 0) {
            throw new IllegalArgumentException("Invalid College ID provided");
        }

        List<Staff> staffList = staffRepository.findAllByCollegeId(collegeId);

        if (staffList == null) {
            return Collections.emptyList();
        }

        return staffList.stream()
                .map(staffMapper::toStaffResponse)
                .toList();
    }

    //--- UPDATE STAFF ACCOUNT STATUS ---//
    @Override
    @Transactional
    public void updateStaffAccountStatus(Integer staffId, String newStatus, Integer collegeId) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff member not found!"));

        // SECURITY CHECK --> Check if the dean is managing their college's staff only! //
        if (!staff.getCollege().getId().equals(collegeId)) {
            throw new RuntimeException("Unauthorized : You cannot manage staff from other colleges!");
        }

        if (!"ACTIVE".equalsIgnoreCase(newStatus)) {
            if (staff.isHod()) {
                throw new RuntimeException("Error: You cannot deactivate an HOD's account. " +
                        "Please assign the HOD role to someone else first!");
            }
        }

        if (!"ACTIVE".equalsIgnoreCase(newStatus)) {
            if (staff.isClubCoordinator()) {
                throw new RuntimeException("Error: You cannot deactivate a club coordinator's account. " +
                        "Please assign the club coordinator role of " + staff.getManagedClub().getShortForm() + "to someone else first!");
            }
        }

        staff.setStatus(AccountStatus.valueOf(newStatus.toUpperCase()));
        staffRepository.save(staff);
    }

    @Override
    @Transactional
    public void updateStaffRole(Integer staffId, String newRole, Integer collegeId){
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(()-> new RuntimeException("Staff member not found!"));

        if (staff.getStatus() == null || !staff.getStatus().name().equalsIgnoreCase("ACTIVE")) {
            String currentStatus = staff.getStatus() != null ? staff.getStatus().name() : "DEACTIVATED";
            throw new RuntimeException("Cannot update role: This staff member is currently " + currentStatus +
                    ". Please ACTIVATE the account before assigning new responsibilities.");
        }

        if(!staff.getCollege().getId().equals(collegeId)){
            throw new RuntimeException("Unauthorized : You cannot manage staff from other colleges!");
        }

        if (staff.isHod() && !"ROLE_HOD".equalsIgnoreCase(newRole)) {
            Integer hodCount = staffRepository.countByBranchIdAndCollegeIdAndIsHodTrue(staff.getBranch().getId(), collegeId);
            if (hodCount <= 1) {
                throw new RuntimeException("Error: Branch " + staff.getBranch().getName() + " must have at least one HOD!");
            }
        }


        if ("ROLE_HOD".equalsIgnoreCase(newRole) && !staff.isHod()) {

            Staff oldHod = staffRepository.findByBranchIdAndCollegeIdAndIsHodTrue(staff.getBranch().getId(), collegeId)
                    .orElse(null);

            if (oldHod != null) {
                oldHod.setHod(false);
                if(oldHod.getUser() != null) {
                    oldHod.getUser().setRole(Role.ROLE_FACULTY);
                    userRepository.save(oldHod.getUser());
                }
                staffRepository.save(oldHod);
            }
        }

        User user = staff.getUser();
        if(user != null){
            user.setRole(Role.valueOf(newRole.toUpperCase()));
            userRepository.save(user);
        }

        staff.setHod("ROLE_HOD".equalsIgnoreCase(newRole));
        staffRepository.save(staff);
    }


    // --- CLUB TABLE will show NULL in coordinator_id, but we can still access coordinator details from CLUB object ---//
    // Single Source of Truth: Data (ID) is stored only in one place to prevent mismatch.
    //Logical Link: Hibernate creates a virtual bridge so the Club object can "reach back" to the Staff member.
    //Efficiency: It saves space in the database while giving full access in the code.

    @Override
    @Transactional
    public void updateStaffClubAssignment(Integer staffId, Integer clubId, Integer collegeId) {
        if (staffId == null) throw new RuntimeException("Invalid Staff ID!");

        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff member not found!"));

        if (staff.getStatus() == null || !staff.getStatus().name().equalsIgnoreCase("ACTIVE")) {
            String currentStatus = staff.getStatus() != null ? staff.getStatus().name() : "DEACTIVATED";
            throw new RuntimeException("Cannot update role: This staff member is currently " + currentStatus +
                    ". Please ACTIVATE the account before assigning new responsibilities.");
        }

        if (!staff.getCollege().getId().equals(collegeId)) {
            throw new RuntimeException("Unauthorized Access!");
        }

        if (clubId != null) {
            // --- CASE: ASSIGNING OR SWAPPING ---
            Club club = clubRepository.findById(clubId)
                    .orElseThrow(() -> new RuntimeException("Club not found!"));

            if (!club.getCollege().getId().equals(collegeId)) {
                throw new RuntimeException("Access Denied: Club belongs to another college!");
            }

            // Auto-swap logic
            staffRepository.findByManagedClubIdAndCollegeId(clubId, collegeId)
                    .ifPresent(existing -> {
                        if (!existing.getId().equals(staffId)) {
                            existing.setManagedClub(null);
                            existing.setClubCoordinator(false);
                            staffRepository.saveAndFlush(existing);
                        }
                    });

            staff.setManagedClub(club);
            staff.setClubCoordinator(true);
        } else {
            // --- CASE: SETTING TO "NONE" ---
            // if the current staff was already a club coordinator of any club
            if (staff.getManagedClub() != null) {
                Integer currentClubId = staff.getManagedClub().getId();

                // Check if there is any other coordinator for this club
                Integer otherCoordinatorsCountForCurrentClub = staffRepository.countByManagedClubIdAndCollegeIdAndIdNot(currentClubId, collegeId, staffId);

                if (otherCoordinatorsCountForCurrentClub == 0) {
                    throw new RuntimeException("Security Rule: " + staff.getManagedClub().getShortForm() +
                            " must have at least one coordinator. Assign a new one first to auto-swap!");
                }
            }
            staff.setManagedClub(null);
            staff.setClubCoordinator(false);
        }
        staffRepository.save(staff);
    }
}
