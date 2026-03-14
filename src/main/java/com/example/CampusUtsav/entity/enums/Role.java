package com.example.CampusUtsav.entity.enums;


public enum Role {
    ROLE_STUDENT,
    ROLE_CLUB,
    ROLE_FACULTY,    // New
    ROLE_HOD,        // New
    ROLE_PRINCIPAL,  // New
    ROLE_DEAN
}

//  Prefix ROLE_ is helpful because hasRole("ADMIN") internally maps to ROLE_ADMIN.
//  It helps to keep things consistent.
