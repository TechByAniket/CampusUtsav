package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.AttendanceTokenResponse;
import com.example.CampusUtsav.dtos.EventAttendanceResponse;
import com.example.CampusUtsav.dtos.EventAttendanceStatusResponse;
import com.example.CampusUtsav.dtos.miniDtos.StudentAttendance;
import com.example.CampusUtsav.entity.*;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.mapper.EventAttendanceMapper;
import com.example.CampusUtsav.repository.*;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.EventAttendanceService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EventAttendanceServiceImpl implements EventAttendanceService {

    private final EventRepository eventRepository;
    private final StudentRepository studentRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final EventAttendanceRepository eventAttendanceRepository;
    private final StaffRepository staffRepository;
    private final EventAttendanceMapper eventAttendanceMapper;

    @Override
    @Transactional
    public String markAttendance(
            String token,
            CustomUserDetails currentUser
    ) {

        if (currentUser.getUser().getRole() != Role.ROLE_STUDENT) {
            throw new AccessDeniedException("Unauthorised");
        }

        // =========================
        // 0. Extract eventId from token
        // =========================
        token = token.trim();

        String[] parts = token.split("-");

        if (parts.length != 3) {
            throw new RuntimeException("Invalid QR format");
        }

        Integer eventId;
        try {
            eventId = Integer.parseInt(parts[0]);
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid eventId in QR");
        }

        // =========================
        // 1. Fetch event
        // =========================
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        // =========================
        // 2. Attendance session check
        // =========================
        if (!event.isAttendanceActive()) {
            throw new RuntimeException("Attendance not started");
        }

        if (event.getAttendanceSalt() == null) {
            throw new RuntimeException("Attendance not initialized properly");
        }

        LocalDateTime now = LocalDateTime.now();

        if (event.getAttendanceEndTime() != null &&
                now.isAfter(event.getAttendanceEndTime())) {
            throw new RuntimeException("Attendance session expired");
        }

        // =========================
        // 3. Token validation (ROTATING + SALT)
        // =========================
        long window = System.currentTimeMillis() / 30000;

        String salt = event.getAttendanceSalt();

        String expected = eventId + "-" + salt + "-" + window;
        String previous = eventId + "-" + salt + "-" + (window - 1);

        if (!token.equals(expected) && !token.equals(previous)) {
            throw new RuntimeException("Invalid or expired QR");
        }

        Integer studentId = currentUser.getProfileId();

        // =========================
        // 4. Registration check
        // =========================
        boolean registered =
                eventRegistrationRepository.existsByEvent_IdAndStudent_Id(eventId, studentId)
                        || teamMemberRepository.existsByEvent_IdAndStudent_Id(eventId, studentId);

        if (!registered) {
            throw new RuntimeException("Not registered for this event");
        }

        // =========================
        // 5. Duplicate check
        // =========================
        if (eventAttendanceRepository.existsByEvent_IdAndStudent_Id(eventId, studentId)) {
            throw new RuntimeException("Attendance already marked");
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));

        // =========================
        // 6. Save attendance
        // =========================
        EventAttendance attendance = eventAttendanceMapper.toEventAttendanceEntity(
                event,
                student,
                true,
                now
        );

        eventAttendanceRepository.save(attendance);

        return "Attendance marked successfully";
    }

    // =================================================
    // START ATTENDANCE, GENERATE ATTENDANCE TOKEN
    // =================================================
    @Override
    @Transactional
    public String startAttendance(Integer eventId, CustomUserDetails currentUser) {

        if (currentUser.getUser().getRole() != Role.ROLE_CLUB) {
            throw new AccessDeniedException("Unauthorised");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        // Only owning club
        if (!Objects.equals(event.getClub().getId(), currentUser.getProfileId())) {
            throw new AccessDeniedException("Not allowed");
        }

//        validateAttendanceStartWindow(event);

        // Already active
        if (event.isAttendanceActive()) {
            throw new RuntimeException("Attendance already started");
        }

        LocalDateTime now = LocalDateTime.now();

        // Better salt (less guessable)
        String salt = UUID.randomUUID().toString().replace("-", "").substring(0, 8);

        event.setAttendanceSalt(salt);
        event.setAttendanceActive(true);
        event.setAttendanceStartTime(now);
        event.setAttendanceEndTime(now.plusMinutes(60));

        eventRepository.save(event);

        return "Attendance started successfully";
    }

    @Override
    @Transactional(readOnly = true)
    public EventAttendanceResponse getEventAttendance(Integer eventId, CustomUserDetails currentUser) {

        Role userRole = currentUser.getUser().getRole();

        // Students cannot access
        if (userRole == Role.ROLE_STUDENT) {
            throw new AccessDeniedException("Unauthorised: Access Denied!");
        }

        // =========================
        // 1. Validate event
        // =========================
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        // =========================
        // 2. Role-based access control
        // =========================

        if (userRole == Role.ROLE_PRINCIPAL &&
                !Objects.equals(event.getClub().getCollege().getId(), currentUser.getCollegeId())) {
            throw new AccessDeniedException("You are not allowed to see attendance of other college's event!");
        }

        if (userRole == Role.ROLE_HOD) {
            Staff curHod = staffRepository.findById(currentUser.getProfileId())
                    .orElseThrow(() -> new RuntimeException("HOD profile not found!"));

            if (!curHod.isHod()) {
                throw new AccessDeniedException("You are not Head Of Department!");
            }

            if (!Objects.equals(curHod.getBranch().getId(), event.getClub().getBranch().getId())) {
                throw new AccessDeniedException("You can't view attendance of other branches!");
            }
        }

        if (userRole == Role.ROLE_FACULTY) {
            Staff curFaculty = staffRepository.findById(currentUser.getProfileId())
                    .orElseThrow(() -> new RuntimeException("Faculty profile not found!"));

            if (!curFaculty.isClubCoordinator()) {
                throw new AccessDeniedException("You are not a Club Coordinator!");
            }

            if (!Objects.equals(curFaculty.getManagedClub().getId(), event.getClub().getId())) {
                throw new AccessDeniedException("You can't view other club's event attendance!");
            }
        }

        if (userRole == Role.ROLE_CLUB &&
                !Objects.equals(currentUser.getProfileId(), event.getClub().getId())) {
            throw new AccessDeniedException("Unauthorised: You can't view other club's event attendance!");
        }

        // =========================
        // 3. Collect ALL participants
        // =========================
        List<Student> allParticipants = new ArrayList<>();

        List<EventRegistration> individualRegistrations =
                eventRegistrationRepository.findByEvent_IdAndStudentIsNotNull(eventId);

        allParticipants.addAll(
                individualRegistrations.stream()
                        .map(EventRegistration::getStudent)
                        .toList()
        );

        List<TeamMember> teamMembers =
                teamMemberRepository.findByEvent_Id(eventId);

        allParticipants.addAll(
                teamMembers.stream()
                        .map(TeamMember::getStudent)
                        .toList()
        );

        // =========================
        // 4. Remove duplicates
        // =========================
        Set<Integer> seenIds = new HashSet<>();
        List<Student> uniqueParticipants = new ArrayList<>();

        for (Student student : allParticipants) {
            if (seenIds.add(student.getId())) {
                uniqueParticipants.add(student);
            }
        }

        // =========================
        // 5. Fetch attendance records
        // =========================
        List<EventAttendance> attendanceRecords =
                eventAttendanceRepository.findByEvent_Id(eventId);

        Map<Integer, EventAttendance> attendanceByStudentId =
                attendanceRecords.stream()
                        .collect(Collectors.toMap(
                                record -> record.getStudent().getId(),
                                record -> record
                        ));

        // =========================
        // 6. Build response
        // =========================
        List<StudentAttendance> attendees = uniqueParticipants.stream()
                .map(student -> {
                    EventAttendance attendance = attendanceByStudentId.get(student.getId());
                    return eventAttendanceMapper.toStudentAttendance(student, attendance);
                })
                .toList();

        // =========================
        // 7. Final response
        // =========================
        return eventAttendanceMapper.toEventAttendanceResponse(
                eventId,
                uniqueParticipants,
                attendanceRecords,
                attendees
        );
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceTokenResponse getAttendanceToken(
            Integer eventId,
            CustomUserDetails currentUser
    ) {

        Role role = currentUser.getUser().getRole();

        if (role != Role.ROLE_CLUB) {
            throw new AccessDeniedException("Not allowed to access attendance QR");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        // Ownership check (IMPORTANT FIX)
        if (!Objects.equals(currentUser.getProfileId(), event.getClub().getId())) {
            throw new AccessDeniedException("You can't access this event QR");
        }

//        validateAttendanceStartWindow(event);

        // =========================
        // 1. Session validation
        // =========================
        if (!event.isAttendanceActive()) {
            throw new RuntimeException("Attendance not started");
        }

        if (event.getAttendanceSalt() == null) {
            throw new RuntimeException("Attendance not initialized properly");
        }

        LocalDateTime now = LocalDateTime.now();

        if (event.getAttendanceEndTime() != null &&
                now.isAfter(event.getAttendanceEndTime())) {
            throw new RuntimeException("Attendance session expired");
        }

        // =========================
        // 2. Generate rotating token
        // =========================
        long window = System.currentTimeMillis() / 30000;

        String token = eventId + "-" + event.getAttendanceSalt() + "-" + window;

        // =========================
        // 3. Return response
        // =========================
        return AttendanceTokenResponse.builder()
                .eventId(eventId)
                .token(token)
                .expiresAt(event.getAttendanceEndTime())
                .build();
    }

    @Override
    @Transactional
    public String stopAttendance(Integer eventId, CustomUserDetails currentUser) {

        if (currentUser.getUser().getRole() != Role.ROLE_CLUB) {
            throw new AccessDeniedException("Unauthorised");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        // Ownership check
        if (!Objects.equals(event.getClub().getId(), currentUser.getProfileId())) {
            throw new AccessDeniedException("Not allowed");
        }

//        validateAttendanceStartWindow(event);

        // If not active
        if (!event.isAttendanceActive()) {
            throw new RuntimeException("Attendance is not active");
        }

        // Stop attendance
        event.setAttendanceActive(false);

        // Optional: end it immediately
        event.setAttendanceEndTime(LocalDateTime.now());

        eventRepository.save(event);

        return "Attendance stopped successfully";
    }

    @Override
    @Transactional(readOnly = true)
    public EventAttendanceStatusResponse getEventAttendanceStatus(Integer eventId, CustomUserDetails currentUser) {

        if(currentUser.getUser().getRole() != Role.ROLE_CLUB){
            throw new AccessDeniedException("Unauthorised!");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        if (!Objects.equals(event.getClub().getId(), currentUser.getProfileId())) {
            throw new AccessDeniedException("Not allowed");
        }

//        validateAttendanceStartWindow(event);

        return EventAttendanceStatusResponse.builder()
                .active(event.isAttendanceActive())
                .startTime(event.getAttendanceStartTime())
                .endTime(event.getAttendanceEndTime())
                .build();
    }

    private void validateAttendanceStartWindow(Event event) {

        LocalDateTime now = LocalDateTime.now();

        LocalDate eventDate = event.getDate();
        LocalTime eventStartTime = event.getStartTime();

        LocalDateTime eventStartDateTime = LocalDateTime.of(eventDate, eventStartTime);

        // Attendance can only be started one hour before event startTime
        LocalDateTime allowedStartTime = eventStartDateTime.minusHours(1);

        if (now.isBefore(allowedStartTime)) {
            throw new RuntimeException(
                    "Attendance can only be started within 1 hour before event start time"
            );
        }

        LocalTime eventEndTime = event.getEndTime();

        if (eventEndTime == null) {
            throw new RuntimeException("Event end time not defined");
        }

        LocalDateTime eventEndDateTimePlusTwoHours = LocalDateTime.of(eventDate, eventEndTime).plusHours(2);

        if(now.isAfter(eventEndDateTimePlusTwoHours)){
            throw new RuntimeException("Event already ended, attendance window is closed!");
        }
    }
}
