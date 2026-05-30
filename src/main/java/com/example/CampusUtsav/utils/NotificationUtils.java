package com.example.CampusUtsav.utils;

import com.example.CampusUtsav.entity.Club;
import com.example.CampusUtsav.entity.Staff;
import com.example.CampusUtsav.entity.enums.AccountStatus;
import org.springframework.stereotype.Component;

@Component
public class NotificationUtils {

    public String accountStatusUpdateNotificationMessage(AccountStatus status, Club club){
        String clubName = club.getName();
        if (status == AccountStatus.ACTIVE) {
            return "Dear Club Representative,\n\n"
                    + "Congratulations! Your club '" + clubName + "' has been successfully approved. "
                    + "You now have full access to all features and can begin engaging with the campus community. "
                    + "If you have any questions, please feel free to reach out to your college principal. "
                    + "For further assistance, you may also contact our support team.\n\n"
                    + "Best regards,\nCampusUtsav Team";
        } else if (status == AccountStatus.SUSPENDED) {
            return "Dear Club Representative,\n\n"
                    + "We regret to inform you that your club '" + clubName + "' has been temporarily suspended due to a violation of our guidelines. "
                    + "Please contact your college principal for more information and to discuss the steps required to resolve this issue. "
                    + "If additional assistance is needed, you may also reach out to our support team.\n\n"
                    + "Thank you for your understanding.\nCampusUtsav Team";
        } else if (status == AccountStatus.DEACTIVATED) {
            return "Dear Club Representative,\n\n"
                    + "Your club '" + clubName + "' has been deactivated. This may be due to inactivity or other administrative reasons. "
                    + "If you believe this is a mistake or would like to discuss reactivation, please contact your college principal. "
                    + "For further assistance, you may also reach out to our support team.\n\n"
                    + "Best regards,\nCampusUtsav Team";
        } else {
            return "Dear Club Representative,\n\n"
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
}
