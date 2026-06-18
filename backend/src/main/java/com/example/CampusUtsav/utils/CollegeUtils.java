package com.example.CampusUtsav.utils;

import org.springframework.stereotype.Component;

@Component
public class CollegeUtils {
    public String generateCollegeUsername(String shortForm, String city, String district) {
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
