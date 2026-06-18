package com.example.CampusUtsav.dtos.miniDtos;

import com.example.CampusUtsav.entity.Club;
import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.enums.EventCategory;
import com.example.CampusUtsav.entity.enums.EventStatus;
import com.example.CampusUtsav.entity.enums.EventType;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventSummary {
    private Integer id;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private EventCategory eventCategory;
    private EventType eventType;
    private String venue;
    private String remarks;
    private EventStatus status;
    private String posterUrl;
    private Integer clubId;
    private String clubNameShortForm;
    private String clubLogoUrl;
    private String clubName;

//    public static EventSummary from(Event event){
//        if(event ==  null) return null;
//        return EventSummary.builder()
//                .id(event.getId())
//                .title(event.getTitle())
//                .date(event.getDate())
//                .clubId(event.getClub().getId())
//                .clubName(event.getClub().getName())
//                .build();
//    }
}
