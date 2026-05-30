package com.example.CampusUtsav.entity.enums;

public enum NotificationType {

    // =========================
    // ACCOUNT ACTIVATION, STATUS & ROLE
    // =========================
    ACCOUNT_ACTIVATION_REQUEST,
    ACCOUNT_STATUS_CHANGE,
    ROLE_UPDATE,

    // =========================
    // EVENT WORKFLOW
    // =========================
    EVENT_SUBMITTED,
    EVENT_APPROVED,
    EVENT_REJECTED,
    EVENT_REVERTED,
    EVENT_UPDATED,
    EVENT_CANCELLED,
    EVENT_COMPLETED,

    // =========================
    // TEAM MANAGEMENT
    // =========================
    TEAM_INVITE,
    TEAM_MEMBER_JOINED,
    TEAM_MEMBER_LEFT,
    TEAM_MEMBER_REMOVED,
    TEAM_LEADER_CHANGED,

    // =========================
    // EVENT REGISTRATION
    // =========================
    REGISTRATION_SUCCESS,
    REGISTRATION_CANCELLED,
    REGISTRATION_REJECTED,

    // =========================
    // ATTENDANCE
    // =========================
    ATTENDANCE_MARKED,

    // =========================
    // GENERAL
    // =========================
    ANNOUNCEMENT
}
