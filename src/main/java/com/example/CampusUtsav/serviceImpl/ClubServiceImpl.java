package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.ClubRegistrationRequest;
import com.example.CampusUtsav.dtos.ClubResponse;
import com.example.CampusUtsav.dtos.CollegeResponse;
import com.example.CampusUtsav.dtos.miniDtos.ClubSummary;
import com.example.CampusUtsav.entity.Branch;
import com.example.CampusUtsav.entity.Club;
import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.entity.User;
import com.example.CampusUtsav.entity.enums.AccountStatus;
import com.example.CampusUtsav.entity.enums.NotificationType;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.mapper.ClubMapper;
import com.example.CampusUtsav.repository.BranchRepository;
import com.example.CampusUtsav.repository.ClubRepository;
import com.example.CampusUtsav.repository.CollegeRepository;
import com.example.CampusUtsav.repository.UserRepository;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.ClubService;
import com.example.CampusUtsav.service.NotificationService;
import com.example.CampusUtsav.service.SupabaseService;
import com.example.CampusUtsav.utils.ClubUtils;
import com.example.CampusUtsav.utils.NotificationUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.AccessDeniedException;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Service
@AllArgsConstructor
public class ClubServiceImpl implements ClubService {

    private final CollegeRepository collegeRepository;
    private final ClubRepository clubRepository;
    private final ClubMapper clubMapper;
    private final ClubUtils clubUtils;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final SupabaseService supabaseService;
    private final BranchRepository branchRepository;
    private final NotificationService notificationService;
    private final NotificationUtils notificationUtils;

    @Override
    @Transactional
    public String registerClub(ClubRegistrationRequest request, Integer collegeId, MultipartFile logoFile) {
//      Find the college from DB
        College linkedCollege = collegeRepository.findById(collegeId)
                                .orElseThrow(()-> new EntityNotFoundException("College Not Found!"));

        Branch linkedBranch;

        if(request.getBranchId() != null)
        {
            linkedBranch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new RuntimeException("Branch not found!"));

            boolean branchExistsInCollege = linkedCollege.getBranches().stream()
                    .anyMatch(branch -> branch.getId().equals(linkedBranch.getId()));

            if(!branchExistsInCollege) throw new RuntimeException("Your college doesn't have the selected branch!");
        } else {
            linkedBranch = null;
        }

        String logoUrl = supabaseService.uploadFile(logoFile);
        if(logoUrl.isEmpty()){
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to upload logo"
            );
        }

//      Convert the request into the entity
        Club newClub = clubMapper.convertToClubEntity(request);
        newClub.setCollege(linkedCollege);
        newClub.setUsername(clubUtils.generateClubUsername(newClub.getShortForm(), collegeId, linkedCollege.getShortForm()));

        if(request.getBranchId() != null){
            newClub.setBranch(linkedBranch);
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User user = User.builder()
                .email(newClub.getAdminEmail())
                .passwordHash(encodedPassword)
                .role(Role.ROLE_CLUB)
                .build();

        userRepository.save(user);

        // Linking with corresponding entity
        newClub.setUser(user);
        newClub.setPasswordHash(encodedPassword);
        newClub.setLogoUrl(logoUrl);
        newClub.setStatus(AccountStatus.PENDING);

        clubRepository.save(newClub);

        // ==================================
        // NOTIFY PRINCIPAL ABOUT NEW CLUB REGISTRATION REQUEST
        // ==================================
        User principalUser = linkedCollege.getUser();

        notificationService.createNotification(
                principalUser,
                "New Club Registration Request",
                "Club " + newClub.getShortForm() + " has requested account activation and verification.",
                NotificationType.ACCOUNT_ACTIVATION_REQUEST,
                "/clubs"
        );

        return "Club Registered Successfully!";
    }


    @Override
    public List<ClubSummary> getAllClubsForPrincipal(CustomUserDetails currentPrincipal){
        Integer collegeId = currentPrincipal.getCollegeId();
        College curCollege = collegeRepository.findById(collegeId)
                .orElseThrow(()-> new RuntimeException("College not found!"));

        List<Club> clubs = clubRepository.findByCollege(curCollege);

        if (clubs.isEmpty()) return Collections.emptyList();

        return clubs.stream()
                .map(clubMapper :: convertToClubSummary)
                .toList();
    }

    @Override
    public List<ClubSummary> getAllClubsByCollege(Integer collegeId){
        College linkedCollege = collegeRepository.findById(collegeId)
                .orElseThrow(()-> new EntityNotFoundException("College Not Found!"));

        List<Club> clubs = clubRepository.findByCollegeAndStatus(linkedCollege, AccountStatus.ACTIVE);

        if(clubs.isEmpty()){
            throw new RuntimeException("No clubs found for: " + linkedCollege.getName());
        }

        return clubs.stream()
                .map(clubMapper::convertToClubSummary)
                .toList();
    }

    @Override
    public ClubResponse getClubDetailsByClubId(Integer collegeId, Integer clubId){
        Club club = clubRepository.findById(clubId)
                .orElseThrow(()-> new EntityNotFoundException("Club Not Found!"));

        if (!Objects.equals(club.getCollege().getId(), collegeId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not allowed to access this club as it does not belong to your college."
            );
        }

        return clubMapper.convertToClubResponse(club);
    }

    @Override
    @Transactional
    public String updateClubAccountStatus(Integer clubId,
                                          String newStatus,
                                          CustomUserDetails currentPrincipal) throws AccessDeniedException {

        if(currentPrincipal.getUser().getRole() != Role.ROLE_PRINCIPAL){
            throw new AccessDeniedException("Unauthorized: You don't have permission to perform this action!");
        }

        if (newStatus == null || newStatus.isBlank()) {
            throw new IllegalArgumentException("Status cannot be empty");
        }

        Club curClub = clubRepository.findById(clubId)
                .orElseThrow(() -> new EntityNotFoundException("Club not found with ID: " + clubId));

        if (!curClub.getCollege().getId().equals(currentPrincipal.getCollegeId())) {
            throw new AccessDeniedException("Access Denied: You can manage clubs of your college only!");
        }

        AccountStatus targetStatus;
        try {
            targetStatus = AccountStatus.valueOf(newStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + newStatus);
        }

        // Update (Dirty checking handles the DB write)
        curClub.setStatus(targetStatus);
        clubRepository.save(curClub); // no need to write if @Transactional

        // ==================================
        // NOTIFY CLUB ABOUT ACCOUNT STATUS CHANGE
        // ==================================

        String message = notificationUtils.accountStatusUpdateNotificationMessage(targetStatus, curClub);

        notificationService.createNotification(
                curClub.getUser(),
                "Club Account Status Updated",
                message,
                NotificationType.ACCOUNT_STATUS_CHANGE,
                targetStatus == AccountStatus.ACTIVE
                        ? "/club-dashboard"
                        : "/auth/sign-in"
        );

        return "Club Status updated to " + targetStatus + " successfully!";
    }

    @Override
    public ClubResponse getMyClubProfileDetails(CustomUserDetails currentUser){
        if (currentUser == null || currentUser.getUser() == null) {
            throw new RuntimeException("Unauthorized access!");
        }

        Role userRole = currentUser.getUser().getRole();

        if (userRole == Role.ROLE_CLUB) {
            Club curClub = clubRepository.findById(currentUser.getProfileId())
                    .orElseThrow(() -> new RuntimeException("Club profile not found!"));

            return clubMapper.convertToClubResponse(curClub);
        }
        throw new RuntimeException("Access Denied: Logged in user is not a CLUB!");
    }
}
