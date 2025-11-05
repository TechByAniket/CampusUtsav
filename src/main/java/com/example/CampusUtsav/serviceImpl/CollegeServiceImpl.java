package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.CollegeRegistrationRequest;
import com.example.CampusUtsav.dtos.CollegeResponse;
import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.mapper.CollegeMapper;
import com.example.CampusUtsav.repository.CollegeRepository;
import com.example.CampusUtsav.service.CollegeService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
//@RequiredArgsConstructor
@AllArgsConstructor
public class CollegeServiceImpl implements CollegeService {

    private final CollegeRepository collegeRepository;
    private final CollegeMapper collegeMapper;

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
        String generatedUsername = generateCollegeUsername(newCollege.getShortForm(), newCollege.getCity(), newCollege.getDistrict());
        newCollege.setUsername(generatedUsername);

        newCollege = collegeRepository.save(newCollege);

        return collegeMapper.convertToCollegeResponse(newCollege);
    }

    private String generateCollegeUsername(String shortForm, String city, String district) {
        String shortName = shortForm.replaceAll("[^A-Za-z]", "")
                .toUpperCase()
                .replaceAll("\\s+", "");
        String cityPart = city.replaceAll("[^A-Za-z]", "")
                .toUpperCase();
        String districtPart = district.replaceAll("[^A-Za-z]", "")
                .toUpperCase();

        // increment for next one
        return shortName + "@" + cityPart + "-" + districtPart;
    }

}
