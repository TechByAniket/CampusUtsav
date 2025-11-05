package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.ClubRegistrationRequest;
import com.example.CampusUtsav.dtos.ClubResponse;
import com.example.CampusUtsav.dtos.CollegeResponse;
import com.example.CampusUtsav.entity.Club;
import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.mapper.ClubMapper;
import com.example.CampusUtsav.repository.ClubRepository;
import com.example.CampusUtsav.repository.CollegeRepository;
import com.example.CampusUtsav.service.ClubService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ClubServiceImpl implements ClubService {

    private final CollegeRepository collegeRepository;
    private final ClubRepository clubRepository;
    private final ClubMapper clubMapper;

    @Override
    public ClubResponse registerClub(ClubRegistrationRequest request, int collegeId) {
//      Find the college from DB
        College linkedCollege = collegeRepository.findById(collegeId)
                                .orElseThrow(()-> new EntityNotFoundException("College Not Found!"));

//      Convert the request into the entity
        Club newClub = clubMapper.convertToClubEntity(request);
        newClub.setCollege(linkedCollege);
        newClub.setUsername(generateClubUsername(newClub.getShortForm(), collegeId, linkedCollege.getShortForm()));

        newClub = clubRepository.save(newClub);

        return clubMapper.convertToClubResponse(newClub);
    }

    private String generateClubUsername(String ClubShortForm, int collegeId, String collegeShortForm){
        return collegeId + ClubShortForm + collegeShortForm;
    }
}
