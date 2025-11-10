package com.example.CampusUtsav.mapper;

import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.EventMemberRegistration;
import com.example.CampusUtsav.entity.EventRegistration;
import com.example.CampusUtsav.entity.Student;
import org.springframework.stereotype.Component;

@Component
public class EventMemberRegistrationMapper {

    public EventMemberRegistration convertToLeader(EventRegistration registeredEvent, Student registeredStudent){
        return EventMemberRegistration.builder()
                .linkedEvent(registeredEvent)
                .event(registeredEvent.getEvent())
                .student(registeredStudent)
                .isLeader(true)
                .build();
    }

    public EventMemberRegistration convertToMember(EventRegistration registeredEvent, Student registeredStudent){
        return EventMemberRegistration.builder()
                .linkedEvent(registeredEvent)
                .event(registeredEvent.getEvent())
                .student(registeredStudent)
                .isLeader(false)
                .build();
    }


}
