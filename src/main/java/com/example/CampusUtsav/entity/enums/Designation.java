package com.example.CampusUtsav.entity.enums;

public enum Designation {
    ASSISTANT_PROFESSOR("Assistant Professor"),
    ASSOCIATE_PROFESSOR("Associate Professor"),
    PROFESSOR("Professor"),
    PRINCIPAL("Principal"),
    DIRECTOR("Director");

    private final String label;

    Designation(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}