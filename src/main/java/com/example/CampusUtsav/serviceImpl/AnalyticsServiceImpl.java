package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.ClubAnalyticsResponse;
import com.example.CampusUtsav.dtos.EventAnalyticsResponse;
import com.example.CampusUtsav.dtos.EventTrendResponse;
import com.example.CampusUtsav.dtos.TopPerformingEventResponse;
import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.Staff;
import com.example.CampusUtsav.entity.enums.EventStatus;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.mapper.AnalyticsMapper;
import com.example.CampusUtsav.repository.*;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.AnalyticsService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

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
    private final AnalyticsMapper analyticsMapper;

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

        // =========================
        // DATE BASED COUNTS
        // =========================

        LocalDate today = LocalDate.now();

        int upcomingEvents =
                eventRepository.countUpcomingEvents(eventIds, today);

        int completedEvents =
                eventRepository.countCompletedEvents(eventIds, today);

        int ongoingEvents =
                eventRepository.countOngoingEvents(eventIds, today);

        // =========================
        // COMPLETED EVENTS ONLY
        // FOR ATTENDANCE ANALYTICS
        // =========================

        List<Integer> completedEventIds =
                eventRepository.findCompletedApprovedEventIds(eventIds, today);

        int totalAttendance =
                completedEventIds.isEmpty()
                        ? 0
                        : eventAttendanceRepository.countPresentByEventIds(completedEventIds);

        int completedParticipants =
                completedEventIds.isEmpty()
                        ? 0
                        : (
                        eventRegistrationRepository.countIndividualRegistrations(completedEventIds)
                                +
                                teamMemberRepository.countActiveMembers(completedEventIds)
                );

        // attendance rate based ONLY on completed events
        double attendanceRate = completedParticipants == 0
                ? 0
                : (totalAttendance * 100.0) / completedParticipants;

        return ClubAnalyticsResponse.builder()
                .totalEvents(totalEvents)
                .eventsUnderApproval(eventsUnderApproval)
                .totalRegistrations(totalRegistrations)
                .totalParticipants(totalParticipants)
                .totalAttendance(totalAttendance)
                .attendanceRate(attendanceRate)
                .individualRegistrations(individualRegs)
                .teamRegistrations(teamRegs)
                .upcomingEvents(upcomingEvents)
                .completedEvents(completedEvents)
                .ongoingEvents(ongoingEvents)
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

    @Override
    public EventAnalyticsResponse getEventAnalytics(Integer eventId, CustomUserDetails currentUser) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        Role role = currentUser.getUser().getRole();

        if (role == Role.ROLE_CLUB) {
            if (!Objects.equals(event.getClub().getId(), currentUser.getProfileId())) {
                throw new AccessDeniedException("Not your club event");
            }
        }

        else if (role == Role.ROLE_FACULTY) {
            Staff faculty = staffRepository.findById(currentUser.getProfileId())
                    .orElseThrow(() -> new RuntimeException("Faculty not found"));

            if (!faculty.isClubCoordinator() ||
                    !Objects.equals(faculty.getManagedClub().getId(), event.getClub().getId())) {
                throw new AccessDeniedException("Not your club event");
            }
        }

        else if (role == Role.ROLE_HOD) {
            Staff hod = staffRepository.findById(currentUser.getProfileId())
                    .orElseThrow(() -> new RuntimeException("HOD not found"));

            if (!hod.isHod() ||
                    !Objects.equals(hod.getBranch().getId(), event.getClub().getBranch().getId())) {
                throw new AccessDeniedException("Not your branch event");
            }
        }

        else if (role == Role.ROLE_PRINCIPAL) {
            if (!Objects.equals(event.getClub().getCollege().getId(), currentUser.getCollegeId())) {
                throw new AccessDeniedException("Not your college event");
            }
        }

        if (event.getStatus() != EventStatus.APPROVED
                || !event.getEndDate().isBefore(LocalDate.now())) {

            throw new AccessDeniedException(
                    "Analytics only available for completed events"
            );
        }

        // =========================
        // ANALYTICS
        // =========================

        int individualRegs =
                eventRegistrationRepository.countIndividualByEvent(eventId);

        int teamRegs =
                teamRepository.countValidTeamsByEvent(eventId);

        int totalRegistrations = individualRegs + teamRegs;


        int teamMembers =
                teamMemberRepository.countActiveMembersByEvent(eventId);

        int totalParticipants = individualRegs + teamMembers;


        int totalAttendance =
                eventAttendanceRepository.countPresentByEvent(eventId);


        double attendanceRate = totalParticipants == 0 ? 0 :
                (totalAttendance * 100.0) / totalParticipants;


        double dropOffRate = totalParticipants == 0 ? 0 :
                ((totalParticipants - totalAttendance) * 100.0) / totalParticipants;


        return EventAnalyticsResponse.builder()
                .totalRegistrations(totalRegistrations)
                .totalParticipants(totalParticipants)
                .totalAttendance(totalAttendance)
                .attendanceRate(attendanceRate)
                .dropOffRate(dropOffRate)
                .individualRegistrations(individualRegs)
                .teamRegistrations(teamRegs)
                .build();
    }

    @Override
    public List<TopPerformingEventResponse> getTopPerformingEvents(Integer limit,
                                                                   CustomUserDetails currentUser
    ) {

        Role role = currentUser.getUser().getRole();

        List<Integer> eventIds;

        // =========================
        // LIMIT VALIDATION
        // =========================

        if (limit == null || limit <= 0) {
            limit = 5;
        }

        // optional protection
        if (limit > 20) {
            limit = 20;
        }

        // =========================
        // ROLE BASED SCOPING
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
            throw new AccessDeniedException("Unauthorized");
        }

        // =========================
        // EMPTY CASE
        // =========================

        if (eventIds.isEmpty()) {
            return List.of();
        }

        // =========================
        // ONLY COMPLETED EVENTS
        // =========================

        List<Integer> completedEventIds =
                eventRepository.findCompletedApprovedEventIds(
                        eventIds,
                        LocalDate.now()
                );

        if (completedEventIds.isEmpty()) {
            return List.of();
        }

        // =========================
        // FETCH EVENTS
        // =========================

        List<Event> events =
                eventRepository.findAllById(completedEventIds);

        List<TopPerformingEventResponse> response =
                new ArrayList<>();

        // =========================
        // BUILD ANALYTICS
        // =========================

        for (Event event : events) {

            Integer eventId = event.getId();

            int individualRegs =
                    eventRegistrationRepository.countIndividualByEvent(eventId);

            int teamMembers =
                    teamMemberRepository.countActiveMembersByEvent(eventId);

            int totalParticipants =
                    individualRegs + teamMembers;

            int totalAttendance =
                    eventAttendanceRepository.countPresentByEvent(eventId);

            double attendanceRate =
                    totalParticipants == 0
                            ? 0
                            : (totalAttendance * 100.0) / totalParticipants;

            response.add(
                    TopPerformingEventResponse.builder()
                            .eventId(event.getId())
                            .eventName(event.getTitle())
                            .clubShortForm(event.getClub().getShortForm())
                            .totalParticipants(totalParticipants)
                            .totalAttendance(totalAttendance)
                            .attendanceRate(attendanceRate)
                            .build()
            );
        }

        // =========================
        // SORT DESCENDING
        // =========================

        response.sort((a, b) ->
                Double.compare(
                        b.getAttendanceRate(),
                        a.getAttendanceRate()
                )
        );

        // =========================
        // APPLY LIMIT
        // =========================

        return response.stream()
                .limit(limit)
                .toList();
    }

    @Override
    public List<EventTrendResponse> getEventTrends(
            Integer year,
            Integer clubId,
            CustomUserDetails currentUser
    ) {

        if (year == null || year < 2000) {
            throw new RuntimeException("Invalid year");
        }

        Role role = currentUser.getUser().getRole();

        List<Integer> eventIds;

        // =========================
        // ROLE BASED ACCESS
        // =========================

        if (role == Role.ROLE_CLUB) {

            Integer currentClubId = currentUser.getProfileId();

            // club users cannot access other clubs
            if (clubId != null && !Objects.equals(clubId, currentClubId)) {
                throw new AccessDeniedException("Access denied");
            }

            eventIds = eventRepository.findApprovedEventIdsByClubAndYear(
                    currentClubId,
                    year
            );
        }

        else if (role == Role.ROLE_FACULTY) {

            Staff faculty = staffRepository.findById(currentUser.getProfileId())
                    .orElseThrow(() -> new RuntimeException("Faculty not found"));

            if (!faculty.isClubCoordinator()) {
                throw new AccessDeniedException("You are not a Club Coordinator!");
            }

            Integer managedClubId =
                    faculty.getManagedClub().getId();

            if (clubId != null && !Objects.equals(clubId, managedClubId)) {
                throw new AccessDeniedException("Access denied");
            }

            eventIds = eventRepository.findApprovedEventIdsByClubAndYear(
                    managedClubId,
                    year
            );
        }

        else if (role == Role.ROLE_HOD) {

            Staff hod = staffRepository.findById(currentUser.getProfileId())
                    .orElseThrow(() -> new RuntimeException("HOD not found"));

            if (!hod.isHod()) {
                throw new AccessDeniedException("You are not HOD!");
            }

            Integer branchId =
                    hod.getBranch().getId();

            // optional club filter
            if (clubId != null) {

                boolean validClub =
                        clubRepository.existsByIdAndBranchId(clubId, branchId);

                if (!validClub) {
                    throw new AccessDeniedException(
                            "Club does not belong to your branch"
                    );
                }

                eventIds = eventRepository.findApprovedEventIdsByClubAndYear(clubId, year);
            }

            else {
                eventIds = eventRepository.findApprovedEventIdsByBranchAndYear(branchId, year);
            }
        }

        else if (role == Role.ROLE_PRINCIPAL) {

            Integer collegeId = currentUser.getCollegeId();

            boolean exists =
                    clubRepository.existsByCollegeId(collegeId);

            if (!exists) {
                throw new AccessDeniedException("Invalid college access!");
            }

            // optional club filter
            if (clubId != null) {

                boolean validClub = clubRepository.existsByIdAndCollegeId(clubId, collegeId);

                if (!validClub) {
                    throw new AccessDeniedException(
                            "Club does not belong to your college"
                    );
                }

                eventIds = eventRepository.findApprovedEventIdsByClubAndYear(clubId, year);
            }

            else {
                eventIds = eventRepository.findApprovedEventIdsByCollegeAndYear(collegeId, year);
            }
        }

        else {
            throw new AccessDeniedException("Unauthorized");
        }

        // =========================
        // NO EVENTS CASE
        // =========================

        if (eventIds.isEmpty()) {
            return analyticsMapper.buildEmptyTrendResponse();
        }

        // =========================
        // FETCH MONTHLY COUNTS
        // =========================

        List<Object[]> rawData = eventRepository.countEventsMonthWise(eventIds);
        // Object[] = [monthNumber, count]

        Map<Integer, Integer> monthCountMap = new HashMap<>();

        for (Object[] row : rawData) {

            Integer month = ((Number) row[0]).intValue();

            Integer count = ((Number) row[1]).intValue();

            monthCountMap.put(month, count);
        }

        // =========================
        // ENSURE ALL 12 MONTHS
        // =========================

        List<String> months = List.of(
                "JAN", "FEB", "MAR", "APR",
                "MAY", "JUN", "JUL", "AUG",
                "SEP", "OCT", "NOV", "DEC"
        );

        List<EventTrendResponse> response =
                new ArrayList<>();

        for (int i = 1; i <= 12; i++) {

            response.add(
                    EventTrendResponse.builder()
                            .month(months.get(i - 1))
                            .count(monthCountMap.getOrDefault(i, 0))
                            .build()
            );
        }

        return response;
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
