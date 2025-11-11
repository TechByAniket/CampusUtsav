package com.example.CampusUtsav.entity.enums;


public enum Role {
    ROLE_SUPER_ADMIN,
    ROLE_COLLEGE,
    ROLE_CLUB,
    ROLE_STUDENT
}

//  Prefix ROLE_ is helpful because hasRole("ADMIN") internally maps to ROLE_ADMIN.
//  It helps to keep things consistent.
