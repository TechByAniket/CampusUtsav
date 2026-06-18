package com.example.CampusUtsav.utils;

import org.springframework.stereotype.Component;

@Component
public class ClubUtils {
    public String generateClubUsername(String ClubShortForm, int collegeId, String collegeShortForm){
        return collegeId + ClubShortForm + collegeShortForm;
    }
}
