package com.example.CampusUtsav.mapper;

import com.example.CampusUtsav.dtos.EventLogResponse;
import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.EventLog;
import com.example.CampusUtsav.entity.enums.EventStatus;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.repository.EventLogRepository;
import org.springframework.stereotype.Component;

@Component
public class EventLogMapper {

    public EventLog toEventLogEntity(EventStatus action, Role actionBy, Role forwardedTo, EventStatus fromStatus, EventStatus toStatus, String remarks, Event curEvent, Integer version){
        return EventLog.builder()
                .action(action)
                .actionBy(actionBy)
                .forwardedTo(forwardedTo)
                .fromStatus(fromStatus)
                .toStatus(toStatus)
                .remarks(remarks)
                .version(version)
                .event(curEvent)
                .build();
    }

    public EventLogResponse toEventLogResponse(EventLog curLog){
        return EventLogResponse.builder()
                .id(curLog.getId())
                .eventId(curLog.getEvent().getId())
                .version(curLog.getVersion())
                .action(curLog.getAction())
                .actionBy(curLog.getActionBy())
                .forwardedTo(curLog.getForwardedTo())
                .fromStatus(curLog.getFromStatus())
                .toStatus(curLog.getToStatus())
                .remarks(curLog.getRemarks())
                .timestamp(curLog.getTimestamp())
                .build();
    }
}
