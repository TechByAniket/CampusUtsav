package com.example.CampusUtsav.entity.enums;

public enum AccountStatus {
    PENDING,    // Just registered, waiting for email/admin verification
    ACTIVE,     // Full access to the system
    SUSPENDED,  // Temporarily locked (e.g., misconduct or pending dues)
    DEACTIVATED // Account closed (e.g., student graduated or faculty left)
}