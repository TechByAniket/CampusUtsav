package com.example.CampusUtsav.entity.enums;

public enum EmailType {

    // Authentication & Security
    ACCOUNT_VERIFICATION,
    ACCOUNT_STATUS_CHANGE,
    PASSWORD_RESET,
    PASSWORD_CHANGED,

    // Approval Workflow
    EVENT_APPROVAL_REQUEST,
    EVENT_SUBMITTED,
    EVENT_APPROVED,
    EVENT_REJECTED,
    EVENT_REVERTED,

    // Membership & Access
    TEAM_MEMBER_ADDED,
    TEAM_MEMBER_REMOVED,
    ROLE_UPDATE,

    // Registration & Participation
    REGISTRATION_CONFIRMED,
    REGISTRATION_CANCELLED,

    // Reminders
    REMINDER,

    // General
    ACTION_REQUIRED,
    ANNOUNCEMENT
}