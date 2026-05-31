package com.example.CampusUtsav.utils;

import com.example.CampusUtsav.entity.Club;
import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.Staff;
import com.example.CampusUtsav.entity.enums.AccountStatus;
import com.example.CampusUtsav.entity.enums.EventStatus;
import org.springframework.stereotype.Component;

@Component
public class NotificationUtils {

    public String accountStatusUpdateNotificationMessage(AccountStatus status, Club club) {

        String clubName = club.getShortForm();

        if (status == AccountStatus.ACTIVE) {

            return "Hello " + clubName + " Team,\n\n"
                    + "Congratulations! Your club '" + clubName + "' has been successfully approved. "
                    + "You now have full access to all features and can begin engaging with the campus community. "
                    + "If you have any questions, please feel free to reach out to your college principal. "
                    + "For further assistance, you may also contact our support team.\n\n"
                    + "Best regards,\nCampusUtsav Team";

        } else if (status == AccountStatus.SUSPENDED) {

            return "Hello " + clubName + " Team,\n\n"
                    + "We regret to inform you that your club '" + clubName + "' has been temporarily suspended due to a violation of our guidelines. "
                    + "Please contact your college principal for more information and to discuss the steps required to resolve this issue. "
                    + "If additional assistance is needed, you may also reach out to our support team.\n\n"
                    + "Thank you for your understanding.\nCampusUtsav Team";

        } else if (status == AccountStatus.DEACTIVATED) {

            return "Hello " + clubName + " Team,\n\n"
                    + "Your club '" + clubName + "' has been deactivated. This may be due to inactivity or other administrative reasons. "
                    + "If you believe this is a mistake or would like to discuss reactivation, please contact your college principal. "
                    + "For further assistance, you may also reach out to our support team.\n\n"
                    + "Best regards,\nCampusUtsav Team";

        } else {

            return "Hello " + clubName + " Team,\n\n"
                    + "The status of your club '" + clubName + "' has been updated to: " + status + ". "
                    + "If you have any questions or require further assistance, please reach out to your college principal. "
                    + "For additional help, you may also contact our support team.\n\n"
                    + "Best regards,\nCampusUtsav Team";
        }
    }

    public String accountStatusUpdateNotificationMessage(AccountStatus status, Staff staff) {
        String staffName = staff.getName();
        if (status == AccountStatus.ACTIVE) {
            return "Dear " + staffName + ",\n\n"
                    + "We are pleased to inform you that your account has been successfully activated. "
                    + "You now have full access to the system and can begin utilizing all available features. "
                    + "If you have any questions, please feel free to reach out to your college principal. "
                    + "If further assistance is needed, you may also contact our support team.\n\n"
                    + "Best regards,\nCampusUtsav Team";
        } else if (status == AccountStatus.SUSPENDED) {
            return "Dear " + staffName + ",\n\n"
                    + "We regret to inform you that your account has been temporarily suspended due to a violation of our guidelines. "
                    + "Please reach out to your college principal for further details and to discuss the steps required to resolve this issue. "
                    + "If additional assistance is required, you may contact our support team.\n\n"
                    + "Thank you for your understanding.\nCampusUtsav Team";
        } else if (status == AccountStatus.DEACTIVATED) {
            return "Dear " + staffName + ",\n\n"
                    + "Your account has been deactivated. This may be due to inactivity or other administrative reasons. "
                    + "If you believe this is a mistake or would like to discuss reactivation, please contact your college principal. "
                    + "If further assistance is needed, you may also reach out to our support team.\n\n"
                    + "Best regards,\nCampusUtsav Team";
        } else {
            return "Dear " + staffName + ",\n\n"
                    + "The status of your account has been updated to: " + status + ". "
                    + "If you have any questions or require further assistance, please reach out to your college principal. "
                    + "If additional help is needed, you may also contact our support team.\n\n"
                    + "Best regards,\nCampusUtsav Team";
        }
    }

    public String eventStatusChangeNotificationMessage(EventStatus status, Event event) {

        String clubName = event.getClub().getShortForm();
        String eventTitle = event.getTitle();

        if (status == EventStatus.SUBMITTED) {

            return "Hello " + clubName + " Team,\n\n"
                    + "Your event proposal '" + eventTitle + "' has been submitted successfully and is now under review. "
                    + "The approval process will proceed through the designated authority levels. "
                    + "You will receive further updates as the review progresses.\n\n"
                    + "Best regards,\nCampusUtsav Team";

        } else if (status == EventStatus.FACULTY1_APPROVED) {

            return "Hello " + clubName + " Team,\n\n"
                    + "Your event '" + eventTitle + "' has been approved by the Faculty Coordinator and has been forwarded to the next stage for further review. "
                    + "You will be notified once the next stage of approval is completed.\n\n"
                    + "Best regards,\nCampusUtsav Team";

        } else if (status == EventStatus.HOD_APPROVED) {

            return "Hello " + clubName + " Team,\n\n"
                    + "Your event '" + eventTitle + "' has been approved by the HOD and has successfully progressed to the next stage of the approval workflow. "
                    + "Please wait for the final review decision.\n\n"
                    + "Best regards,\nCampusUtsav Team";

        } else if (status == EventStatus.REVERTED) {

            return "Hello " + clubName + " Team,\n\n"
                    + "Your event '" + eventTitle + "' has been reverted for corrections or additional updates. "
                    + "Please review the feedback provided by the reviewing authority and make the necessary changes before resubmitting the event.\n\n"
                    + "Best regards,\nCampusUtsav Team";

        } else if (status == EventStatus.APPROVED) {

            return "Hello " + clubName + " Team,\n\n"
                    + "Congratulations! Your event '" + eventTitle + "' has received final approval and is now officially published on the platform. "
                    + "Participants can now view and register for the event.\n\n"
                    + "We wish you great success for your event.\nCampusUtsav Team";

        } else if (status == EventStatus.REJECTED) {

            return "Hello " + clubName + " Team,\n\n"
                    + "We regret to inform you that your event '" + eventTitle + "' has been rejected during the review process. "
                    + "Please contact the reviewing authority for further clarification regarding the decision.\n\n"
                    + "Best regards,\nCampusUtsav Team";

        } else if (status == EventStatus.COMPLETED) {

            return "Hello " + clubName + " Team,\n\n"
                    + "Your event '" + eventTitle + "' has been marked as completed successfully. "
                    + "Thank you for organizing and contributing to campus activities through CampusUtsav.\n\n"
                    + "Best regards,\nCampusUtsav Team";

        } else if (status == EventStatus.CANCELLED) {

            return "Hello " + clubName + " Team,\n\n"
                    + "Your event '" + eventTitle + "' has been cancelled. "
                    + "If this cancellation was unintentional or requires further clarification, please contact the reviewing authority.\n\n"
                    + "Best regards,\nCampusUtsav Team";

        } else {

            return "Hello " + clubName + " Team,\n\n"
                    + "The status of your event '" + eventTitle + "' has been updated to: " + status + ". "
                    + "Please check the event dashboard for the latest updates.\n\n"
                    + "Best regards,\nCampusUtsav Team";
        }
    }
}
