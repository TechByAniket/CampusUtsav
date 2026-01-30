package com.example.CampusUtsav.dtos;

import com.example.CampusUtsav.entity.Club;
import com.example.CampusUtsav.entity.enums.EventCategory;
import com.example.CampusUtsav.entity.enums.EventStatus;
import com.example.CampusUtsav.entity.enums.EventType;
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
        private int teamSize;
        private int maxParticipants;
        private List<String> attachments;
        private List<String> tags;
        private EventStatus status;
        private String registrationLink;
        private Map<String, Map<String, String>> contactDetails; // name → phone
        private String extraInfo; // JSON string
        private Club club;
        private Integer collegeId;
//      private String clubName; // for frontend display
        private boolean isFeatured;
        private boolean isActive;
    }

