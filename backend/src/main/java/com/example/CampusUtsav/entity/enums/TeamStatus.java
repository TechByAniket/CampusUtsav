package com.example.CampusUtsav.entity.enums;

public enum TeamStatus {
    VALID("Valid"),
    INCOMPLETE("Incomplete"),
    CANCELLED("Cancelled");

    private final String label;

    TeamStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}