package com.example.CampusUtsav.dtos.miniDtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class IndividualRegistration {

    private Integer registrationId;
    private StudentSummary student;

    private boolean paymentDone;
    private LocalDateTime registeredAt;
}