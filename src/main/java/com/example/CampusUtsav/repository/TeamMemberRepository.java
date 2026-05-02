package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.entity.TeamMember;
import com.example.CampusUtsav.entity.enums.TeamMemberStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Integer> {
    boolean existsByEvent_IdAndStudent_Id(Integer eventId, Integer studentId);

    List<TeamMember> findByEvent_Id(Integer eventId);

    // =========================
    // Fetch TEAM registrations of a student
    // =========================
    List<TeamMember> findByStudent_Id(Integer studentId);

    List<TeamMember> findByStudent_IdAndStatus(
                    Integer studentId,
                    TeamMemberStatus status
            );

    boolean existsByEvent_IdAndStudent_IdAndStatus(Integer eventId,
                                                   Integer studentId,
                                                   TeamMemberStatus status
    );
}
