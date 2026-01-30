package com.example.CampusUtsav.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum EventType {
        /* Technical / Academic */
        HACKATHON(EventCategory.TECHNICAL),
        WORKSHOP(EventCategory.TECHNICAL),
        SEMINAR(EventCategory.TECHNICAL),
        STUDY_CIRCLE(EventCategory.TECHNICAL),
        CONFERENCE(EventCategory.TECHNICAL),
        COMPETITION(EventCategory.TECHNICAL),
        PROJECT_EXHIBITION(EventCategory.TECHNICAL),
        QUIZ(EventCategory.TECHNICAL),

        /* Literary */
        LITERARY_OR_ORATORY(EventCategory.LITERARY),

        /* Cultural */
        FEST(EventCategory.CULTURAL),
        CULTURAL(EventCategory.CULTURAL),
        MUSIC(EventCategory.CULTURAL),
        DANCE(EventCategory.CULTURAL),
        DRAMA(EventCategory.CULTURAL),
        EXHIBITION(EventCategory.CULTURAL),

        /* Sports */
        SPORTS(EventCategory.SPORTS),
        TOURNAMENT(EventCategory.SPORTS),
        ESPORTS(EventCategory.SPORTS),

        /* Professional */
        WEBINAR(EventCategory.PROFESSIONAL),
        PLACEMENT_DRIVE(EventCategory.PROFESSIONAL),
        JOB_FAIR(EventCategory.PROFESSIONAL),
        INTERNSHIP_FAIR(EventCategory.PROFESSIONAL),
        ENTREPRENEURSHIP_EVENT(EventCategory.PROFESSIONAL),
        STARTUP_PITCH(EventCategory.PROFESSIONAL),
        ALUMNI_TALK(EventCategory.PROFESSIONAL),

        /* Social */
        COMMUNITY_SERVICE(EventCategory.SOCIAL),
        SOCIAL_AWARENESS(EventCategory.SOCIAL),
        CLEANLINESS_DRIVE(EventCategory.SOCIAL),
        BLOOD_DONATION(EventCategory.SOCIAL),
        TREE_PLANTATION(EventCategory.SOCIAL),
        FUNDRAISER(EventCategory.SOCIAL),
        CHARITY_EVENT(EventCategory.SOCIAL),
        MENTAL_HEALTH_AWARENESS(EventCategory.SOCIAL),
        ENVIRONMENTAL_CAMPAIGN(EventCategory.SOCIAL),
        VOLUNTEERING_EVENT(EventCategory.SOCIAL),

        /* Misc */
        CELEBRATION(EventCategory.MISC),
        ORIENTATION(EventCategory.MISC),
        OTHER(EventCategory.MISC);

        private final EventCategory category;

        EventType(EventCategory category) {
                this.category = category;
        }

        public EventCategory getCategory() {
                return category;
        }

//  It tells Jackson (JSON parser):
//  “When converting JSON → EventType, use this method.”
    @JsonCreator
    public static EventType fromString(String value) {
        return EventType.valueOf(value.toUpperCase());
    }
}
