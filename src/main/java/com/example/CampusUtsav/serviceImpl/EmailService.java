package com.example.CampusUtsav.serviceImpl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${app.email.enabled:true}")
    private boolean emailEnabled;

    @Value("${app.email.override-recipient:}")
    private String overrideRecipient;

    private final JavaMailSender mailSender;

    public void sendTestEmail() {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("campusutsav.noreply@gmail.com");
        message.setTo("aniketkhemnar45@gmail.com");

        message.setSubject("CampusUtsav Test");
        message.setText("SMTP is working!");

        mailSender.send(message);
    }
}
