package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.StaffRegistrationRequest;
import com.example.CampusUtsav.dtos.StaffResponse;
import com.example.CampusUtsav.entity.*;
import com.example.CampusUtsav.entity.enums.AccountStatus;
import com.example.CampusUtsav.entity.enums.NotificationType;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.exception.DuplicateResourceException;
import com.example.CampusUtsav.mapper.StaffMapper;
import com.example.CampusUtsav.repository.*;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.NotificationService;
import com.example.CampusUtsav.service.StaffService;
import com.example.CampusUtsav.serviceImpl.helper.EntityLookupService;
import com.example.CampusUtsav.utils.NotificationUtils;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
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
    private final NotificationService notificationService;
    private final NotificationUtils notificationUtils;
    private final EntityLookupService entityLookupService;

    @Override
    @Transactional
    public String registerStaff(StaffRegistrationRequest req) {

        College linkedCollege = entityLookupService.getCollege(req.getCollegeId());

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

        Branch linkedBranch = entityLookupService.getBranch(req.getBranchId());

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
        Staff staff = entityLookupService.getStaff(staffId);

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

        AccountStatus status = AccountStatus.valueOf(newStatus.toUpperCase());

        staff.setStatus(status);
        staffRepository.save(staff);

        // ================================================
        // NOTIFY STAFF ABOUT THEIR ACCOUNT STATUS CHANGE
        // ================================================

        String message = notificationUtils.
                accountStatusUpdateNotificationMessage(
                        staff.getStatus(),
                        staff
                );

        notificationService.createNotification(
                staff.getUser(),
                "Staff Account Status Updated",
                message,
                NotificationType.ACCOUNT_STATUS_CHANGE,
                status == AccountStatus.ACTIVE
                        ? "/staff-dashboard"
                        : "/auth/sign-in"
        );
    }

    @Override
    @Transactional
    public void updateStaffRole(Integer staffId, String newRole, Integer collegeId){
        Staff staff = entityLookupService.getStaff(staffId);

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

        // ==========================================
        // NOTIFY STAFF ABOUT ROLE CHANGE
        // ==========================================

        Role updatedRole = Role.valueOf(newRole.toUpperCase());

        String message = "Your role has been updated to "
                + updatedRole
                + " by the administration. Please review your updated permissions and responsibilities in the dashboard.";

        notificationService.createNotification(
                staff.getUser(),
                "Role Updated",
                message,
                NotificationType.ROLE_UPDATE,
                "/staff-dashboard"
        );
    }


    // --- CLUB TABLE will show NULL in coordinator_id, but we can still access coordinator details from CLUB object ---//
    // Single Source of Truth: Data (ID) is stored only in one place to prevent mismatch.
    //Logical Link: Hibernate creates a virtual bridge so the Club object can "reach back" to the Staff member.
    //Efficiency: It saves space in the database while giving full access in the code.

    @Override
    @Transactional
    public void updateStaffClubAssignment(Integer staffId, Integer clubId, Integer collegeId) {
        if (staffId == null) throw new RuntimeException("Invalid Staff ID!");

        Staff staff = entityLookupService.getStaff(staffId);

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
            Club club = entityLookupService.getClub(clubId);

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

        // ===========================================
        // NOTIFY STAFF ABOUT THEIR CLUB ASSIGNMENT
        // ===========================================

        String message;

        if (clubId != null) {
            message = "You have been assigned as the coordinator for the club '"
                    + staff.getManagedClub().getShortForm()
                    + "'. You can now manage club activities and responsibilities through your dashboard.";
        } else {
            message = "You have been removed from the club coordinator role. "
                    + "You no longer have management access to club operations. "
                    + "Please contact administration for further details.";
        }

        notificationService.createNotification(
                staff.getUser(),
                "Club Assignment Updated",
                message,
                NotificationType.CLUB_ASSIGNMENT_CHANGE,
                "/staff-dashboard"
        );
    }

    // ************* GET PROFILE DETAILS OF A STAFF *********** //
    @Override
    public StaffResponse getMyStaffProfileDetails(CustomUserDetails currentUser) {
        if (currentUser == null || currentUser.getUser() == null) {
            throw new RuntimeException("Unauthorized access!");
        }

        Role userRole = currentUser.getUser().getRole();

        if (userRole == Role.ROLE_FACULTY || userRole == Role.ROLE_HOD) {
            Staff curStaff = entityLookupService.getStaff(currentUser.getProfileId());

            return staffMapper.toStaffResponse(curStaff);
        }

        throw new RuntimeException("Access Denied: Logged in user is not a STAFF!");
    }
}
