package com.example.CampusUtsav.utils;

import org.springframework.stereotype.Component;

@Component
public class BranchUtils {
    public String generateShortForm(String name){
        String normalized = name.trim().toLowerCase().replaceAll("\\s+", "");
        switch(normalized){
            case "computerengineering":
            case "computerscienceengineering":
                return "COMP";

            case "artificialintelligenceandmachinelearning":
                return "AIML";

            case "artificialintelligenceanddatascience":
                return "AIDS";

            case "datascience":
                return "DS";

            case "informationtechnology":
                return "IT";

            case "electronicsandcomputerscience":
                return "ECS";

            case "electronicsandtelecommunication":
                return "EXTC";

            case "mechanicalengineering":
                return "MECH";

            case "automobileengineering":
                return "AUTO";

            default:
                // fallback: take first 4 letters in uppercase
                return name.length() >= 4 ? name.substring(0, 4).toUpperCase() : name.toUpperCase();
        }
    }
}
