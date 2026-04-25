package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.repository.ClubRepository;
import com.example.CampusUtsav.repository.CollegeRepository;
import com.example.CampusUtsav.repository.EventRepository;
import com.example.CampusUtsav.repository.StaffRepository;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.AnalyticsService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final CollegeRepository collegeRepository;
    private final EventRepository eventRepository;
    private final StaffRepository staffRepository;

    @Override
    public Map<String, Integer> getEventsCountByClub(CustomUserDetails currentUser) {
        if (currentUser == null) {
            throw new RuntimeException("Unauthorised! Login first!");
        }

        Role userRole = currentUser.getUser().getRole();
        Integer collegeId = currentUser.getCollegeId();
        Integer profileId = currentUser.getProfileId();

        List<Object[]> eventsCount;

        if (userRole == Role.ROLE_PRINCIPAL) {
            validateCollege(collegeId);
            eventsCount = eventRepository.countEventsByClubShortFormForCollege(collegeId);
        }
        else if (userRole == Role.ROLE_HOD) {
            validateHOD(profileId);
            Integer branchId = staffRepository.getBranchIdOfStaffByStaffId(profileId);

            if (branchId == null) {
                throw new RuntimeException("No branch assigned to this HOD!");
            }

            eventsCount = eventRepository.countEventsByClubShortFormAndBranchForCollege(collegeId, branchId);
        }
        else {
            throw new RuntimeException("Access Denied: Role not authorized for analytics!");
        }

        return mapToCountMap(eventsCount, "club");
    }

    @Override
    public Map<String, Integer> getEventsCountByCategory(CustomUserDetails currentUser) {
        if (currentUser == null) {
            throw new RuntimeException("Unauthorised! Login first.");
        }

        Role userRole = currentUser.getUser().getRole();
        Integer collegeId = currentUser.getCollegeId();

        List<Object[]> eventsCountByCategory;

        if (userRole == Role.ROLE_PRINCIPAL) {
            validateCollege(collegeId);
            eventsCountByCategory = eventRepository.countEventsByCategoryForCollege(collegeId);
        }
        else if (userRole == Role.ROLE_HOD) {
            validateHOD(currentUser.getProfileId());
            Integer branchId = staffRepository.getBranchIdOfStaffByStaffId(currentUser.getProfileId());
            if (branchId == null) throw new RuntimeException("Branch not assigned!");

            eventsCountByCategory = eventRepository.countEventsByCategoryForBranch(collegeId, branchId);
        }
        else if (userRole == Role.ROLE_FACULTY) {
            Integer staffId = currentUser.getProfileId();
            validateFaculty(staffId);
            // ---!!! CHECK IF FACULTY MANAGES A CLUB OR NOT !!!--- //
            eventsCountByCategory = eventRepository.countEventsByCategoryForCoordinator(collegeId, staffId);
        } else {
            throw new RuntimeException("Access Denied: You don't have permission to view analytics.");
        }
        return mapToCountMap(eventsCountByCategory, "category");
    }

    private Map<String, Integer> mapToCountMap(List<Object[]> rawData, String labelType) {
        Map<String, Integer> counts = new HashMap<>();
        if (rawData != null) {
            for (Object[] row : rawData) {
                // label == clubName for 'getEventsCountByClub' & label = categoryName for 'getEventsCountByCategory'
                String label = (row[0] != null) ? row[0].toString() : "Unknown";
                Integer count = (row[1] != null) ? ((Number) row[1]).intValue() : 0;
                counts.put(label, count);
            }
        }
        return counts;
    }

    private void validateCollege(Integer collegeId) {
        if (!collegeRepository.existsById(collegeId)) {
            throw new RuntimeException("College profile not found!");
        }
    }

    private void validateHOD(Integer profileId) {
        // combine exists and active check in one query if possible,
        // otherwise this is fine.
        if (!staffRepository.checkIfActiveHOD(profileId)) {
            throw new RuntimeException("HOD profile not found or inactive!");
        }
    }

    private void validateFaculty(Integer profileId) {
        // combine exists and active check in one query if possible,
        // otherwise this is fine.
        if (!staffRepository.existsById(profileId)) {
            throw new RuntimeException("Faculty/Staff profile not found!");
        }
    }
}
