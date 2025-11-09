package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.EventRegistrationRequest;
import com.example.CampusUtsav.dtos.EventRegistrationResponse;
import com.example.CampusUtsav.entity.EventRegistration;
import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;

public interface EventRegistrationService {
    @Transactional
    EventRegistrationResponse registerForEvent(Integer eventId, EventRegistrationRequest request) throws BadRequestException;

    @Transactional
    EventRegistrationResponse joinTeamByInviteLink(String inviteCode, Integer studentId) throws BadRequestException;
}
