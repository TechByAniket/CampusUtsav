package com.example.CampusUtsav.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum EventType {
    HACKATHON,
    SEMINAR,
    WORKSHOP,
    CULTURAL,
    SPORTS,
    OTHER;

    @JsonCreator
    public static EventType fromString(String value) {
        return EventType.valueOf(value.toUpperCase());
    }
}
