package com.example.CampusUtsav.entity.enums;

public enum RegistrationStatus {

    REGISTERED("Registered"),
    CANCELLED_BY_STUDENT("Cancelled by Student"),
    CANCELLED_BY_LEADER("Cancelled by Leader"),
    CANCELLED_BY_CLUB("Cancelled by Club Admin"),
    CANCELLED_BY_PRINCIPAL("Cancelled by Principal");

    private final String label;

    RegistrationStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}