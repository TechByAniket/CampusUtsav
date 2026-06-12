package com.example.CampusUtsav.serviceImpl.helper;

import com.example.CampusUtsav.entity.*;
import com.example.CampusUtsav.exception.ResourceNotFoundException;
import com.example.CampusUtsav.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EntityLookupService {

    private final BranchRepository branchRepository;
    private final ClubRepository clubRepository;
    private final CollegeRepository collegeRepository;
    private final EventRepository eventRepository;
    private final EventAttendanceRepository eventAttendanceRepository;
    private final EventLogRepository eventLogRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    private final NotificationRepository notificationRepository;
    private final StaffRepository staffRepository;
    private final StudentRepository studentRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;

    public Branch getBranch(Integer branchId) {
        return branchRepository.findById(branchId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Branch not found"));
    }

    public Club getClub(Integer clubId) {
        return clubRepository.findById(clubId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Club not found"));
    }

    public Club getClub(String email) {
        return clubRepository.findByAdminEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Club not found"));
    }

    public College getCollege(Integer collegeId) {
        return collegeRepository.findById(collegeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("College not found"));
    }

    public College getCollege(String email) {
        return collegeRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("College not found"));
    }

    public Event getEvent(Integer eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Event not found"));
    }

    public EventAttendance getEventAttendance(Integer attendanceId) {
        return eventAttendanceRepository.findById(attendanceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Attendance not found"));
    }

    public EventLog getEventLog(Integer eventLogId) {
        return eventLogRepository.findById(eventLogId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Event log not found"));
    }

    public EventRegistration getEventRegistration(Integer registrationId) {
        return eventRegistrationRepository.findById(registrationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Registration not found"));
    }

    public Notification getNotification(Integer notificationId) {
        return notificationRepository.findById(notificationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Notification not found"));
    }

    public Staff getStaff(Integer staffId) {
        return staffRepository.findById(staffId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Staff not found"));
    }

    public Staff getStaff(String email) {
        return staffRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Staff not found"));
    }

    public Student getStudent(Integer studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found"));
    }

    public Team getTeam(Integer teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Team not found"));
    }

    public TeamMember getTeamMember(Integer teamMemberId) {
        return teamMemberRepository.findById(teamMemberId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Team member not found"));
    }

    public User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    public User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }
}