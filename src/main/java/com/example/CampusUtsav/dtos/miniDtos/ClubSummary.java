package com.example.CampusUtsav.dtos.miniDtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClubSummary {
    private Integer id;
    private String name;
    private String shortForm;
    private String adminName;
    private String logoUrl;
}
