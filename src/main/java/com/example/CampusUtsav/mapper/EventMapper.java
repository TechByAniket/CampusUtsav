package com.example.CampusUtsav.mapper;

import com.example.CampusUtsav.dtos.EventRequest;
import com.example.CampusUtsav.dtos.EventResponse;
import com.example.CampusUtsav.dtos.miniDtos.EventSummary;
import com.example.CampusUtsav.entity.Club;
import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.enums.EventStatus;
import com.example.CampusUtsav.entity.enums.Role;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@AllArgsConstructor
public class EventMapper {

    private final ClubMapper clubMapper;

    public Event convertToEventEntity(EventRequest req, College linkedCollege, Club linkedClub){
        String normalizedTitle = req.getTitle().trim().toLowerCase().replaceAll("\\s+", "");

        return Event.builder()
                .title(req.getTitle())
                .normalizedTitle(normalizedTitle)
                .eventCategory(req.getEventCategory())
                .eventType(req.getEventType())
                .fees(req.getFees())
                .description(req.getDescription())
                .allowedBranches(req.getAllowed_branches())
                .allowedYears(req.getAllowed_years())
//                .posterUrl(req.getPosterUrl())
                .venue(req.getVenue())
                .date(req.getDate())
                .registrationDeadline(req.getRegistrationDeadline())
                .startTime(req.getStartTime())
                .endTime(req.getEndTime())
                .teamEvent(req.isTeamEvent())
                .teamSize(req.getTeamSize())
                .maxParticipants(req.getMaxParticipants())
                .privateAttachments(req.getPrivateAttachments())
                .publicAttachments(req.getPublicAttachments())
                .tags(req.getTags())
                .status(EventStatus.SUBMITTED)
                .registrationLink(req.getRegistrationLink())
                .contactDetails(req.getContactDetails())
                .pendingApprovalAt(Role.ROLE_FACULTY)
//                .extraInfo(req.getExtraInfo())
                .club(linkedClub)
                .build();
    }

    public void updateEventFromRequest(EventRequest req, Event existingEvent) {
        String normalizedTitle = req.getTitle().trim().toLowerCase().replaceAll("\\s+", "");

        existingEvent.setTitle(req.getTitle());
        existingEvent.setNormalizedTitle(normalizedTitle);
        existingEvent.setEventCategory(req.getEventCategory());
        existingEvent.setEventType(req.getEventType());
        existingEvent.setFees(req.getFees());
        existingEvent.setDescription(req.getDescription());
        existingEvent.setAllowedBranches(req.getAllowed_branches());
        existingEvent.setAllowedYears(req.getAllowed_years());
        existingEvent.setVenue(req.getVenue());
        existingEvent.setDate(req.getDate());
        existingEvent.setRegistrationDeadline(req.getRegistrationDeadline());
        existingEvent.setStartTime(req.getStartTime());
        existingEvent.setEndTime(req.getEndTime());
        existingEvent.setTeamEvent(req.isTeamEvent());
        existingEvent.setTeamSize(req.getTeamSize());
        existingEvent.setMaxParticipants(req.getMaxParticipants());
        existingEvent.setPrivateAttachments(req.getPrivateAttachments());
        existingEvent.setPublicAttachments(req.getPublicAttachments());
        existingEvent.setTags(req.getTags());
        existingEvent.setRegistrationLink(req.getRegistrationLink());
        existingEvent.setContactDetails(req.getContactDetails());
        existingEvent.setStatus(EventStatus.SUBMITTED);
        existingEvent.setPendingApprovalAt(Role.ROLE_FACULTY);
    }

    public EventResponse convertToEventResponse(Event event, Map<Integer,String> allowedBranches, Map<Integer, String> allowedYears){
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .eventCategory(event.getEventCategory())
                .eventType(event.getEventType())
                .fees(event.getFees())
                .description(event.getDescription())
                .posterUrl(event.getPosterUrl())
                .venue(event.getVenue())
                .date(event.getDate())
                .registrationDeadline(event.getRegistrationDeadline())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .teamEvent(event.isTeamEvent())
                .teamSize(event.getTeamSize())
                .maxParticipants(event.getMaxParticipants())
                .publicAttachments(event.getPublicAttachments())
                .privateAttachments(event.getPrivateAttachments())
                .tags(event.getTags())
                .status(event.getStatus())
                .registrationLink(event.getRegistrationLink())
                .contactDetails(event.getContactDetails())
                .allowedBranches(allowedBranches)
                .allowedYears(allowedYears)
//                .extraInfo(event.getExtraInfo())
                .club(clubMapper.convertToClubSummary(event.getClub()))
                .collegeId(event.getClub().getCollege().getId())
                .isFeatured(event.isFeatured())
                .isActive(event.isActive())
                .build();
    }

    public EventSummary convertToEventSummary(Event event){
        if(event ==  null) return null;
        return EventSummary.builder()
                .id(event.getId())
                .title(event.getTitle())
                .date(event.getDate())
                .status(event.getStatus())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .eventCategory(event.getEventCategory())
                .eventType(event.getEventType())
                .posterUrl(event.getPosterUrl())
                .venue(event.getVenue())
                .clubId(event.getClub().getId())
                .clubNameShortForm(event.getClub().getShortForm())
                .clubName(event.getClub().getName())
                .clubLogoUrl(event.getClub().getLogoUrl())
                .build();
    }
}
