package com.example.CampusUtsav.entity.enums;

public enum NotificationType {

    // =========================
    // ACCOUNT ACTIVATION, STATUS & ROLE
    // =========================
    ACCOUNT_ACTIVATION_REQUEST,
    ACCOUNT_STATUS_CHANGE,
    ROLE_UPDATE,
    ACCOUNT_CREATION,
    CLUB_ASSIGNMENT_CHANGE,

    // =========================
    // EVENT WORKFLOW
    // =========================
    EVENT_SUBMITTED,
    EVENT_STATUS_CHANGE,
    EVENT_UPDATED,
    EVENT_CANCELLED,
    EVENT_COMPLETED,

    // =========================
    // TEAM MANAGEMENT
    // =========================
    TEAM_INVITE,
    TEAM_UPDATE,
    TEAM_LEADER_CHANGED,

    // =========================
    // EVENT REGISTRATION
    // =========================
    REGISTRATION_STATUS_CHANGE,

    // =========================
    // ATTENDANCE
    // =========================
    ATTENDANCE_MARKED,

    // =========================
    // GENERAL
    // =========================
    ANNOUNCEMENT,
    ALERT
}