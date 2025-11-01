package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.CollegeRegistrationRequest;
import com.example.CampusUtsav.dtos.CollegeResponse;
import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.mapper.CollegeMapper;
import com.example.CampusUtsav.repository.CollegeRepository;
import com.example.CampusUtsav.service.CollegeService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

@Service
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
        String generatedUniqueId = generateCollegeId(newCollege.getName(), newCollege.getCity(), newCollege.getDistrict());
        newCollege.setId(generatedUniqueId);

        newCollege = collegeRepository.save(newCollege);

        return collegeMapper.convertToCollegeResponse(newCollege);
    }

    private String generateCollegeId(String name, String city, String district) {
        String shortName = name.replaceAll("[^A-Za-z]", "")      // remove non-letters
                .toUpperCase()
                .replaceAll("\\s+", "")            // remove spaces
                .substring(0, Math.min(6, name.length())); // first 4 letters
        String cityPart = city.replaceAll("[^A-Za-z]", "")
                .toUpperCase();
//                .substring(0, Math.min(3, city.length()));
        String districtPart = district.replaceAll("[^A-Za-z]", "")
                .toUpperCase()
                .substring(0, Math.min(3, district.length()));
        int randomNum = (int)(Math.random() * 9000) + 1000;       // 4-digit random
        return randomNum + "-" + shortName + "-" + cityPart + "-" + districtPart;
    }

}
