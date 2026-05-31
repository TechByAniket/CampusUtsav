package com.example.CampusUtsav.utils;

import com.example.CampusUtsav.entity.*;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.repository.StaffRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class EventUtils {

    private final StaffRepository staffRepository;

    // ========================================
    // RECORD CLASS TO HOLD APPROVER INFO FOR NOTIFICATIONS
    // ========================================
    public record ApproverInfo(User approverUser, String approverMessage) {}
    public ApproverInfo buildApproverInfo(
            Role forwardedTo,
            Event newEvent,
            Club linkedClub,
            College linkedCollege
    ) {

        User approverUser;
        String approverMessage;

        if (forwardedTo == Role.ROLE_FACULTY) {

            approverUser = newEvent.getClub().getCoordinator().getUser();

            approverMessage = "A new event proposal '"
                    + newEvent.getTitle()
                    + "' has been submitted by "
                    + linkedClub.getShortForm()
                    + " for faculty review.";

        } else if (forwardedTo == Role.ROLE_HOD) {

            Staff hod = staffRepository
                    .findByUser_RoleAndCollege_IdAndBranch_Id(
                            Role.ROLE_HOD,
                            linkedCollege.getId(),
                            newEvent.getClub().getBranch().getId()
                    )
                    .orElseThrow(() -> new RuntimeException("HOD not found"));

            approverUser = hod.getUser();

            approverMessage = "A new department event proposal '"
                    + newEvent.getTitle()
                    + "' has been submitted by "
                    + linkedClub.getShortForm()
                    + " for HOD review.";

        } else {

            approverUser = linkedCollege.getUser();

            approverMessage = "A new college-level event proposal '"
                    + newEvent.getTitle()
                    + "' has been submitted by "
                    + linkedClub.getShortForm()
                    + " for principal review.";
        }
        return new ApproverInfo(approverUser, approverMessage);
    }
}
