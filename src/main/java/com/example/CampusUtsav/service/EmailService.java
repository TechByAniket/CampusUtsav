package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.EmailTemplate;
import com.example.CampusUtsav.entity.enums.EmailType;
import jakarta.mail.MessagingException;

import java.util.Map;

public interface EmailService {

    void sendEmail(
            String to,
            EmailType emailType,
            EmailTemplate emailTemplate
    );
}
