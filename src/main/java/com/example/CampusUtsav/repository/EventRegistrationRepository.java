package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.EventRegistration;
import com.example.CampusUtsav.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
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
}
