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
import com.example.CampusUtsav.utils.ClubUtils;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ClubServiceImpl implements ClubService {

    private final CollegeRepository collegeRepository;
    private final ClubRepository clubRepository;
    private final ClubMapper clubMapper;
    private final ClubUtils clubUtils;

    @Override
    public ClubResponse registerClub(ClubRegistrationRequest request, int collegeId) {
//      Find the college from DB
        College linkedCollege = collegeRepository.findById(collegeId)
                                .orElseThrow(()-> new EntityNotFoundException("College Not Found!"));

//      Convert the request into the entity
        Club newClub = clubMapper.convertToClubEntity(request);
        newClub.setCollege(linkedCollege);
        newClub.setUsername(clubUtils.generateClubUsername(newClub.getShortForm(), collegeId, linkedCollege.getShortForm()));

        newClub = clubRepository.save(newClub);

        return clubMapper.convertToClubResponse(newClub);
    }

    @Override
    public List<ClubResponse> getAllClubsByCollege(int collegeId){
        College linkedCollege = collegeRepository.findById(collegeId)
                .orElseThrow(()-> new EntityNotFoundException("College Not Found!"));

        List<Club> clubs = clubRepository.findByCollege(linkedCollege);

        if(clubs.isEmpty()){
            throw new RuntimeException("No clubs found for: " + linkedCollege.getName());
        }

        return clubs.stream()
                .map(clubMapper::convertToClubResponse)
                .toList();
    }
}
