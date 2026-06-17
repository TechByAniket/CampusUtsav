package com.example.CampusUtsav.utils;

import com.example.CampusUtsav.dtos.EmailTemplate;
import com.example.CampusUtsav.entity.enums.AccountStatus;
import com.example.CampusUtsav.entity.enums.EmailType;
import org.springframework.stereotype.Component;

@Component
public class EmailUtils {

    public String getSubject(EmailType emailType) {

        return switch (emailType) {

            case ACCOUNT_VERIFICATION ->
                    "Verify Your Account";

            case ACCOUNT_STATUS_CHANGE ->
                    "Account Status Updated";

            case PASSWORD_RESET ->
                    "Reset Your Password";

            case PASSWORD_CHANGED ->
                    "Password Changed Successfully";

            case EVENT_APPROVAL_REQUEST ->
                    "Event Requires Your Approval";

            case EVENT_SUBMITTED ->
                    "Event Submitted Successfully";

            case EVENT_APPROVED ->
                    "Event Approved";

            case EVENT_REJECTED ->
                    "Event Rejected";

            case EVENT_REVERTED ->
                    "Event Reverted";

            case TEAM_MEMBER_ADDED ->
                    "Added to Team";

            case TEAM_MEMBER_REMOVED ->
                    "Removed from Team";

            case ROLE_UPDATE ->
                    "Role Updated";

            case REGISTRATION_CONFIRMED ->
                    "Registration Confirmed";

            case REGISTRATION_CANCELLED ->
                    "Registration Cancelled";

            case REMINDER ->
                    "Reminder";

            case ACTION_REQUIRED ->
                    "Action Required";

            case ANNOUNCEMENT ->
                    "Announcement";
        };
    }

    public EmailTemplate buildClubRegistrationSubmittedEmail(String clubName, String adminName) {

        EmailTemplate emailTemplate = new EmailTemplate();

        emailTemplate.setRecipientName(adminName);
        emailTemplate.setTitle("Club Registration Submitted");
        emailTemplate.setMessage(
                String.format("""
                    Thank you for registering <b>%s</b> on CampusUtsav.
                    Your registration has been submitted successfully and is currently under review.
                    Your account status is <b>PENDING APPROVAL</b>. A college principal must review and approve your registration before you can access the platform.
                    You will receive another email once your account status is updated.
                    """,
                        clubName
                )
        );
        emailTemplate.setEntityName(clubName);
        return emailTemplate;
    }
    public EmailTemplate buildStudentRegistrationSuccessfulEmail(String studentName) {

        EmailTemplate emailTemplate = new EmailTemplate();

        emailTemplate.setRecipientName(studentName);
        emailTemplate.setTitle("Registration Successful");
        emailTemplate.setMessage("""
            Welcome to CampusUtsav!
            Your account has been created successfully.
            You can now browse upcoming events, register for activities, join teams, and stay updated with everything happening on your campus.
            We look forward to seeing your participation in upcoming events.
            """);

        return emailTemplate;
    }

    public EmailTemplate buildClubAccountStatusChangedEmail(
            String clubName,
            String adminName,
            AccountStatus targetStatus
    ) {

        EmailTemplate emailTemplate = new EmailTemplate();

        emailTemplate.setRecipientName(adminName);
        emailTemplate.setTitle("Account Status Updated");

        String message;

        if (targetStatus == AccountStatus.ACTIVE) {

            message = String.format("""
                The account status for <b>%s</b> has been updated to <b>%s</b>.
                Your account is now active and you can log in to CampusUtsav and access all available features.
                We look forward to your participation in campus events and activities.
                """,
                    clubName,
                    targetStatus
            );

        } else {

            message = String.format("""
                The account status for <b>%s</b> has been updated to <b>%s</b>.
                You are currently unable to access CampusUtsav using this account.
                For further clarification or assistance, please contact your college principal.
                """,
                    clubName,
                    targetStatus
            );
        }

        emailTemplate.setMessage(message);
        emailTemplate.setEntityName(clubName);

        return emailTemplate;
    }

    public EmailTemplate buildCollegeRegistrationSuccessfulEmail(
            String collegeName,
            String adminName
    ) {

        EmailTemplate emailTemplate = new EmailTemplate();

        emailTemplate.setRecipientName(adminName);
        emailTemplate.setTitle("Registration Successful");
        emailTemplate.setMessage(
                String.format("""
                    Welcome to CampusUtsav!
                    Your college registration has been completed successfully.
                    You can now log in and start managing clubs, events, approvals, and other campus activities through the platform.
                    We are excited to have <b>%s</b> onboard.
                    """,
                        collegeName
                )
        );

        emailTemplate.setEntityName(collegeName);

        return emailTemplate;
    }
}