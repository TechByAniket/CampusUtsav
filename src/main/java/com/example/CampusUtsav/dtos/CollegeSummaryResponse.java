package com.example.CampusUtsav.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CollegeSummaryResponse {
    private int id;
    private String name;
    private String shortForm;
    private String city;
    private String district;
    private String state;
}
