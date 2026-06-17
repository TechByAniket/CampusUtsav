package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.entity.enums.EmailType;
import com.example.CampusUtsav.service.EmailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public/test-email")
@RequiredArgsConstructor
public class EmailTestController {

    private final EmailService emailService;

    @GetMapping
    public String sendTestEmail() {

        Map<String, Object> variables = new HashMap<>();

        variables.put(
                "title",
                "CampusUtsav Email Test"
        );

        variables.put(
                "message",
                "Congratulations! Your email notification system is working successfully."
        );

        emailService.sendEmail(
                "dummy@test.com",
                EmailType.ANNOUNCEMENT,
                variables
        );

        return "Test email triggered successfully.";
    }
}