package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.EmailTemplate;
import com.example.CampusUtsav.entity.enums.EmailType;
import com.example.CampusUtsav.service.EmailService;
import com.example.CampusUtsav.utils.EmailUtils;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Map;

import static com.example.CampusUtsav.entity.enums.EmailType.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    @Value("${app.email.enabled:true}")
    private boolean emailEnabled;

    @Value("${app.email.override-recipient:}")
    private String overrideRecipient;

    @Value("${app.logo-url}")
    private String logoUrl;

    @Value("${app.email.from}")
    private String fromEmail;

    private final JavaMailSender mailSender;
    private final EmailUtils emailUtils;
    private final SpringTemplateEngine templateEngine;

    @Override
    @Async("emailExecutor")
    public void sendEmail(
            String to,
            EmailType emailType,
            EmailTemplate emailTemplate
    ) {

        log.info("Email method invoked");

        if (!emailEnabled) {
            log.warn("Email sending disabled");
            return;
        }

        String recipient =
                StringUtils.hasText(overrideRecipient)
                        ? overrideRecipient
                        : to;

        log.info("Logo URL: {}", logoUrl);
        log.info("Original recipient: {}", to);
        log.info("Actual recipient: {}", recipient);
        log.info("Email type: {}", emailType);

        String subject = emailUtils.getSubject(emailType);

        Context context = new Context();

        context.setVariable("logoUrl", logoUrl);

        context.setVariable("recipientName", emailTemplate.getRecipientName());
        context.setVariable("title", emailTemplate.getTitle());
        context.setVariable("message", emailTemplate.getMessage());
        context.setVariable("buttonText", emailTemplate.getButtonText());
        context.setVariable("buttonUrl", emailTemplate.getButtonUrl());
        context.setVariable("entityName", emailTemplate.getEntityName());
        context.setVariable("remarks", emailTemplate.getRemarks());

        try {

            log.info("Generating Thymeleaf template");

            String html =
                    templateEngine.process(
                            "emails/base-template",
                            context
                    );

            log.info("Template generated successfully");

            MimeMessage mimeMessage =
                    mailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(
                            mimeMessage,
                            true,
                            "UTF-8"
                    );

            helper.setFrom(fromEmail);
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(html, true);

            log.info("From Email: {}", fromEmail);
            log.info("Sending email to {}", recipient);

            mailSender.send(mimeMessage);

            log.info(
                    "Email sent successfully to {}",
                    recipient
            );

        } catch (Exception e) {

            log.error(
                    "Failed to send email to {}",
                    recipient,
                    e
            );
        }
    }
}
