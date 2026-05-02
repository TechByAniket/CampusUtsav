package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.ClubAnalyticsResponse;
import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.entity.Staff;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.repository.*;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.AnalyticsService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final CollegeRepository collegeRepository;
    private final EventRepository eventRepository;
    private final StaffRepository staffRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final EventAttendanceRepository eventAttendanceRepository;
    private final ClubRepository clubRepository;
    private final TeamRepository teamRepository;

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


    @Override
    public ClubAnalyticsResponse getAnalytics(CustomUserDetails currentUser) {

        Role role = currentUser.getUser().getRole();

        List<Integer> eventIds;

        // =========================
        // 🔐 ROLE VALIDATION + SCOPING
        // =========================

        if (role == Role.ROLE_CLUB) {

            Integer clubId = currentUser.getProfileId();

            eventIds = eventRepository.findEventIdsByClubId(clubId);

        }

        else if (role == Role.ROLE_FACULTY) {

            Staff faculty = staffRepository.findById(currentUser.getProfileId())
                    .orElseThrow(() -> new RuntimeException("Faculty not found"));

            if (!faculty.isClubCoordinator()) {
                throw new AccessDeniedException("You are not a Club Coordinator!");
            }

            Integer clubId = faculty.getManagedClub().getId();

            eventIds = eventRepository.findEventIdsByClubId(clubId);
        }

        else if (role == Role.ROLE_HOD) {

            Staff hod = staffRepository.findById(currentUser.getProfileId())
                    .orElseThrow(() -> new RuntimeException("HOD not found"));

            if (!hod.isHod()) {
                throw new AccessDeniedException("You are not Head Of Department!");
            }

            Integer branchId = hod.getBranch().getId();

            eventIds = eventRepository.findEventIdsByBranchId(branchId);
        }

        else if (role == Role.ROLE_PRINCIPAL) {

            Integer collegeId = currentUser.getCollegeId();

            boolean exists = clubRepository.existsByCollegeId(collegeId);
            if (!exists) {
                throw new AccessDeniedException("Invalid college access!");
            }

            eventIds = eventRepository.findEventIdsByCollegeId(collegeId);
        }

        else {
            throw new AccessDeniedException("Unauthorized for analytics");
        }

        // =========================
        // NO DATA CASE
        // =========================

        if (eventIds.isEmpty()) {
            return emptyResponse();
        }

        // =========================
        // ANALYTICS CALCULATION
        // =========================

        int totalEvents =
                eventRepository.countApprovedEvents(eventIds);

        int eventsUnderApproval =
                eventRepository.countEventsUnderApproval(eventIds);

// Individual registrations
        int individualRegs =
                eventRegistrationRepository.countIndividualRegistrations(eventIds);

// Team registrations (ONLY VALID teams)
        int teamRegs =
                teamRepository.countValidTeams(eventIds);

// registrations = individual + teams
        int totalRegistrations = individualRegs + teamRegs;


// team members (ACTIVE only)
        int teamMembers =
                teamMemberRepository.countActiveMembers(eventIds);

// participants = individuals + team members
        int totalParticipants = individualRegs + teamMembers;


// attendance (per person)
        int totalAttendance =
                eventAttendanceRepository.countPresentByEventIds(eventIds);


// attendance rate (based on participants, NOT registrations)
        double attendanceRate = totalParticipants == 0 ? 0 :
                (totalAttendance * 100.0) / totalParticipants;


// DATE BASED COUNTS
        LocalDate today = LocalDate.now();

        int upcomingEvents =
                eventRepository.countUpcomingEvents(eventIds, today);

        int completedEvents =
                eventRepository.countCompletedEvents(eventIds, today);

// ongoing events
        int ongoingEvents =
                eventRepository.countOngoingEvents(eventIds, today);

        return ClubAnalyticsResponse.builder()
                .totalEvents(totalEvents)
                .eventsUnderApproval(eventsUnderApproval)
                .totalRegistrations(totalRegistrations)
                .totalParticipants(totalParticipants) // 🔥 ADD THIS
                .totalAttendance(totalAttendance)
                .attendanceRate(attendanceRate)
                .individualRegistrations(individualRegs)
                .teamRegistrations(teamRegs)
                .upcomingEvents(upcomingEvents)
                .completedEvents(completedEvents)
                .ongoingEvents(ongoingEvents) // 🔥 ADD THIS
                .build();
    }

    private ClubAnalyticsResponse emptyResponse() {
        return ClubAnalyticsResponse.builder()
                .totalEvents(0)
                .eventsUnderApproval(0)
                .totalParticipants(0)
                .ongoingEvents(0)
                .totalRegistrations(0)
                .totalAttendance(0)
                .attendanceRate(0)
                .individualRegistrations(0)
                .teamRegistrations(0)
                .upcomingEvents(0)
                .completedEvents(0)
                .build();
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
