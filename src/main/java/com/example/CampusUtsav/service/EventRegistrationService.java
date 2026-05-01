package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.EventRegistrationRequest;
import com.example.CampusUtsav.dtos.EventRegistrationResponse;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface EventRegistrationService {
    @Transactional
    EventRegistrationResponse registerForEvent(Integer eventId,
                                               EventRegistrationRequest request,
                                               CustomUserDetails currentUser
    );

    String cancelEventRegistration(@PathVariable Integer registrationId,
                                  @AuthenticationPrincipal CustomUserDetails currentUser) throws AccessDeniedException;

//    @Transactional
//    EventRegistrationResponse joinTeamByInviteLink(String inviteCode, Integer studentId) throws BadRequestException;
//
//    List<EventRegistrationResponse> getAllRegistrationsOfEvent (Integer collegeId, Integer eventId) throws BadRequestException;
}
