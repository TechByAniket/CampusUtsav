package com.example.CampusUtsav.config;

import jakarta.annotation.PostConstruct;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import java.util.Arrays;

@Component
public class ProfileChecker {

    private final Environment env;

    public ProfileChecker(Environment env) {
        this.env = env;
    }

    @PostConstruct
    public void printProfile() {
        System.out.println("Active profile: " +
                Arrays.toString(env.getActiveProfiles()));
    }
}