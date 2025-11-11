package com.example.CampusUtsav.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum EventType {
        // Technical
        HACKATHON,
        WORKSHOP,
        SEMINAR,
        STUDY_CIRCLE,
        CONFERENCE,
        COMPETITION,
        PROJECT_EXHIBITION,
        QUIZ,

        // Literary / Oratory
        LITERARY_OR_ORATORY,

        // Non-technical / Cultural
        CULTURAL,
        FEST,
        MUSIC,
        DANCE,
        DRAMA,
        EXHIBITION,

        // Sports
        SPORTS,
        TOURNAMENT,
        ESPORTS,

        // Professional / Career
        WEBINAR,
        PLACEMENT_DRIVE,
        JOB_FAIR,
        INTERNSHIP_FAIR,
        ENTREPRENEURSHIP_EVENT,
        STARTUP_PITCH,
        ALUMNI_TALK,

        // Social / Misc
        COMMUNITY_SERVICE,
        SOCIAL_AWARENESS,
        CLEANLINESS_DRIVE,
        BLOOD_DONATION,
        TREE_PLANTATION,
        FUNDRAISER,
        CHARITY_EVENT,
        MENTAL_HEALTH_AWARENESS,
        ENVIRONMENTAL_CAMPAIGN,
        VOLUNTEERING_EVENT,
        CELEBRATION,
        ORIENTATION,
        OTHER;


    @JsonCreator
    public static EventType fromString(String value) {
        return EventType.valueOf(value.toUpperCase());
    }
}
