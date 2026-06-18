package com.example.CampusUtsav.entity.enums;

public enum TeamMemberStatus {
    ACTIVE("Active"),
    LEFT("Left"),
    REMOVED_BY_LEADER("Removed by Leader");

    private final String label;

    TeamMemberStatus(String label){
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}