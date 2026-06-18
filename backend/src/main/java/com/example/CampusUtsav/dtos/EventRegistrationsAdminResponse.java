package com.example.CampusUtsav.dtos;

import com.example.CampusUtsav.dtos.miniDtos.IndividualRegistration;
import com.example.CampusUtsav.dtos.miniDtos.TeamRegistration;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventRegistrationsAdminResponse {
    private Integer eventId;

    private List<IndividualRegistration> individuals;

    private List<TeamRegistration> teams;
}
