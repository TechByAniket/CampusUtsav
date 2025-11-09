package com.example.CampusUtsav.mapper;

import com.example.CampusUtsav.dtos.EventRequest;
import com.example.CampusUtsav.dtos.EventResponse;
import com.example.CampusUtsav.entity.Club;
import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.entity.Event;
import org.springframework.stereotype.Component;

@Component
public class EventMapper {
    public Event convertToEventEntity(EventRequest req, College linkedCollege, Club linkedClub){
        String normalizedTitle = req.getTitle().trim().toLowerCase().replaceAll("\\s+", "");

        return Event.builder()
                .title(req.getTitle())
                .normalizedTitle(normalizedTitle)
                .eventType(req.getEventType())
                .fees(req.getFees())
                .description(req.getDescription())
                .posterUrl(req.getPosterUrl())
                .venue(req.getVenue())
                .date(req.getDate())
                .startTime(req.getStartTime())
                .endTime(req.getEndTime())
                .teamEvent(req.isTeamEvent())
                .teamSize(req.getTeamSize())
                .maxParticipants(req.getMaxParticipants())
                .attachments(req.getAttachments())
                .tags(req.getTags())
                .status(req.getStatus())
                .registrationLink(req.getRegistrationLink())
                .contactDetails(req.getContactDetails())
                .extraInfo(req.getExtraInfo())
                .club(linkedClub)
                .build();
    }

    public EventResponse convertToEventResponse(Event event){
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .fees(event.getFees())
                .description(event.getDescription())
                .posterUrl(event.getPosterUrl())
                .venue(event.getVenue())
                .date(event.getDate())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .teamEvent(event.isTeamEvent())
                .teamSize(event.getTeamSize())
                .maxParticipants(event.getMaxParticipants())
                .attachments(event.getAttachments())
                .tags(event.getTags())
                .status(event.getStatus())
                .registrationLink(event.getRegistrationLink())
                .contactDetails(event.getContactDetails())
                .extraInfo(event.getExtraInfo())
                .club(event.getClub())
                .isFeatured(event.isFeatured())
                .isActive(event.isActive())
                .build();
    }
}
