package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.EventMemberRegistration;
import com.example.CampusUtsav.entity.EventRegistration;
import com.example.CampusUtsav.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EventMemberRegistrationRepository extends JpaRepository<EventMemberRegistration, Integer> {

    boolean existsByLinkedEventAndStudent(EventRegistration linkedEventRegistration, Student teamMember);
    // check whether student is a member in any registration for same event
    boolean existsByStudent_IdAndLinkedEvent_Event_Id(Integer studentId, Integer eventId);

//    boolean existsByLinkedEventAndStudent(EventRegistration event, Student teamMember);

    @Query("SELECT CASE WHEN COUNT(emr) > 0 THEN true ELSE false END " +
            "FROM EventMemberRegistration emr " +
            "WHERE emr.student = :student " +
            "AND emr.linkedEvent.event = :event")
    boolean existsByStudentInOtherTeam(@Param("event") Event event, @Param("student") Student member);

    // _Id tells Spring Data JPA: “Look inside the related entity’s primary key field.”
    // It’s more efficient if you already have the ID, because no need to load the full related entity.
    int countByLinkedEvent_Id(Integer id);
}
