package com.example.CampusUtsav.dtos;

import com.example.CampusUtsav.entity.enums.EventStatus;
import com.example.CampusUtsav.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventLogResponse {
    private Integer id;
    private Integer eventId;
    private EventStatus action;
    private Role actionBy;
    private Role forwardedTo;
    private EventStatus fromStatus;
    private EventStatus toStatus;
    private String remarks;
    private Integer version;
    private LocalDateTime timestamp;

}
