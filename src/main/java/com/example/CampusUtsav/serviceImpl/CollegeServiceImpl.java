package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.CollegeRegistrationRequest;
import com.example.CampusUtsav.dtos.CollegeResponse;
import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.repository.CollegeRepository;
import com.example.CampusUtsav.service.CollegeService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CollegeServiceImpl implements CollegeService {

    private final CollegeRepository collegeRepository;

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

        College newCollege = convertToCollegeEntity(req);
        String generatedUniqueId = generateCollegeId(newCollege.getName(), newCollege.getCity(), newCollege.getDistrict());
        newCollege.setId(generatedUniqueId);

        newCollege = collegeRepository.save(newCollege);

        return convertToCollegeResponse(newCollege);
    }

    private String generateCollegeId(String name, String city, String district) {
        String shortName = name.replaceAll("[^A-Za-z]", "")      // remove non-letters
                .toUpperCase()
                .replaceAll("\\s+", "")            // remove spaces
                .substring(0, Math.min(4, name.length())); // first 4 letters
        String cityPart = city.replaceAll("[^A-Za-z]", "")
                .toUpperCase()
                .substring(0, Math.min(3, city.length()));
        String districtPart = district.replaceAll("[^A-Za-z]", "")
                .toUpperCase()
                .substring(0, Math.min(3, district.length()));
        int randomNum = (int)(Math.random() * 9000) + 1000;       // 4-digit random
        return randomNum + "-" + shortName + "-" + cityPart + "-" + districtPart;
    }

    private College convertToCollegeEntity(CollegeRegistrationRequest req){
        String normalized = req.getName().trim().toLowerCase().replaceAll("\\s+", "");
        return College.builder()
                .name(req.getName())
                .normalizedName(normalized)
                .adminName(req.getAdminName())
                .address(req.getAddress())
                .email(req.getEmail())
                .phone(req.getPhone())
                .city(req.getCity())
                .district(req.getDistrict())
                .state(req.getState())
                .websiteUrl(req.getWebsiteUrl())
                .affiliation(req.getAffiliation())
                .passwordHash(req.getPassword())
                .logoUrl(req.getLogoUrl())
                .build();
    }

    private CollegeResponse convertToCollegeResponse(College college){
        return CollegeResponse.builder()
                .id(college.getId())
                .name(college.getName())
                .normalizedName(college.getNormalizedName())
                .affiliation(college.getAffiliation())
                .adminName(college.getAdminName())
                .email(college.getEmail())
                .phone(college.getPhone())
                .city(college.getCity())
                .district(college.getDistrict())
                .state(college.getState())
                .websiteUrl(college.getWebsiteUrl())
                .logoUrl(college.getLogoUrl())
                .createdAt(college.getCreatedAt())
                .updatedAt(college.getUpdatedAt())
                .emailVerified(college.isEmailVerified())
                .phoneVerified(college.isPhoneVerified()) // for boolean there is not 'get' , but 'is'
                .build();
    }

}
