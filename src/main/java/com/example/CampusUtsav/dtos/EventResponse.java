package com.example.CampusUtsav.dtos;

import com.example.CampusUtsav.dtos.miniDtos.ClubSummary;
import com.example.CampusUtsav.entity.Club;
import com.example.CampusUtsav.entity.enums.EventCategory;
import com.example.CampusUtsav.entity.enums.EventStatus;
import com.example.CampusUtsav.entity.enums.EventType;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventResponse {
        private int id;
        private String title;
        private EventCategory eventCategory;
        private EventType eventType;
        private int fees;
        private String description;
        private String posterUrl;
        private String venue;
        private LocalDate date;
        private LocalDate registrationDeadline;
        private LocalTime startTime;
        private LocalTime endTime;
        private boolean teamEvent;
        private int minTeamSize;
        private int maxTeamSize;
        private int maxParticipants;
        private Map<String,Object> publicAttachments;
        private Map<String,Object> privateAttachments;
        private List<String> tags;
        private EventStatus status;
        private String registrationLink;
        private Map<String, Map<String, String>> contactDetails; // name → phone
        private String extraInfo; // JSON string
        private ClubSummary club;
        private Integer collegeId;
        private Map<Integer, String> allowedBranches;
        private Map<Integer, String> allowedYears;

//      private String clubName; // for frontend display
        private boolean isFeatured;
        private boolean isActive;
    }

