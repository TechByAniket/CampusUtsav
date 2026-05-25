package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.entity.EventAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    // ===========================================
    // Attendance record of student of all registered events
    // ===========================================
    List<EventAttendance> findByStudent_IdAndEvent_IdIn(Integer studentId, List<Integer> eventIds);

    @Query("""
    SELECT COUNT(a)
    FROM EventAttendance a
    WHERE a.event.id IN :eventIds
    AND a.present = true
""")
    int countPresentByEventIds(@Param("eventIds") List<Integer> eventIds);

    @Query("""
    SELECT COUNT(a)
    FROM EventAttendance a
    WHERE a.event.id = :eventId
    AND a.present = true
""")
    int countPresentByEvent(@Param("eventId") Integer eventId);
}