package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.ClubRegistrationRequest;
import com.example.CampusUtsav.dtos.ClubResponse;
import com.example.CampusUtsav.dtos.CollegeResponse;
import com.example.CampusUtsav.dtos.miniDtos.ClubSummary;
import com.example.CampusUtsav.entity.Club;
import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.entity.User;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.mapper.ClubMapper;
import com.example.CampusUtsav.repository.ClubRepository;
import com.example.CampusUtsav.repository.CollegeRepository;
import com.example.CampusUtsav.repository.UserRepository;
import com.example.CampusUtsav.service.ClubService;
import com.example.CampusUtsav.service.SupabaseService;
import com.example.CampusUtsav.utils.ClubUtils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

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

    @Override
    @Transactional
    public ClubResponse registerClub(ClubRegistrationRequest request, int collegeId, MultipartFile logoFile) {
//      Find the college from DB
        College linkedCollege = collegeRepository.findById(collegeId)
                                .orElseThrow(()-> new EntityNotFoundException("College Not Found!"));

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

        clubRepository.save(newClub);

        return clubMapper.convertToClubResponse(newClub);
    }

    @Override
    public List<ClubSummary> getAllClubsByCollege(Integer collegeId){
        College linkedCollege = collegeRepository.findById(collegeId)
                .orElseThrow(()-> new EntityNotFoundException("College Not Found!"));

        List<Club> clubs = clubRepository.findByCollege(linkedCollege);

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
}
