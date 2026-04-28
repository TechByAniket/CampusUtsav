package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.entity.EventAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventAttendanceRepository extends JpaRepository<EventAttendance, Integer> {

    // ===========================================
    // Prevent duplicate attendance
    // ===========================================
    boolean existsByEvent_IdAndStudent_Id(Integer eventId, Integer studentId);

    // ===========================================
    // Fetching all attendance for event
    // ===========================================
    List<EventAttendance> findByEvent_Id(Integer eventId);

    // ===========================================
    // Attendance count of event
    // ===========================================
    Integer countByEvent_Id(Integer eventId);
}