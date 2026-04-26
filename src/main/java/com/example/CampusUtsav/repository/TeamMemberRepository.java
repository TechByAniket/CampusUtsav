package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Integer> {
    boolean existsByEvent_IdAndStudent_Id(Integer eventId, Integer studentId);
}
