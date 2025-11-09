package com.example.CampusUtsav.dtos.miniDtos;

import com.example.CampusUtsav.entity.Club;
import com.example.CampusUtsav.entity.Event;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventSummary {
    private Integer id;
    private String title;
    private LocalDate date;
    private Integer clubId;
    private String clubName;

    public static EventSummary from(Event event){
        if(event ==  null) return null;
        return EventSummary.builder()
                .id(event.getId())
                .title(event.getTitle())
                .date(event.getDate())
                .clubId(event.getClub().getId())
                .clubName(event.getClub().getName())
                .build();
    }
}
