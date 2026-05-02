package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.EventRegistration;
import com.example.CampusUtsav.entity.Student;
import com.example.CampusUtsav.entity.enums.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Integer> {
    boolean existsByEventAndStudent(Event linkedEvent, Student registeredStudent);

//    EventRegistration findByInviteCode(String inviteCode);
//    Optional<EventRegistration> findByInviteCode(String inviteCode);

//    List<EventRegistration> findAllByEvent_Id(Integer eventId);

    boolean existsByEvent_IdAndStudent_Id(Integer eventId, Integer studentId);

    List<EventRegistration> findByEvent_Id(Integer eventId);

    @Query("""
    SELECT DISTINCT er FROM EventRegistration er
    LEFT JOIN FETCH er.student s
    LEFT JOIN FETCH er.team t
    LEFT JOIN FETCH t.leader l
    LEFT JOIN FETCH t.members tm
    LEFT JOIN FETCH tm.student ms
    WHERE er.event.id = :eventId
""")
    List<EventRegistration> fetchFullEventGraph(@Param("eventId") Integer eventId);

    List<EventRegistration> findByEvent_IdAndStudentIsNotNull(Integer eventId);

    // =========================
    // Fetch INDIVIDUAL registrations of a student
    // =========================
    List<EventRegistration> findByStudent_Id(Integer studentId);

    List<EventRegistration> findByStudent_IdAndStatus(
                    Integer studentId,
                    RegistrationStatus status
            );

    @Query("""
    SELECT COUNT(er)
    FROM EventRegistration er
    WHERE er.event.id IN :eventIds
    AND er.team IS NULL
    AND er.status = 'REGISTERED'
""")
    int countIndividualRegistrations(@Param("eventIds") List<Integer> eventIds);
}
