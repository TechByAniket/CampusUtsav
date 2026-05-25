package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Integer> {

    @Query("""
    SELECT COUNT(t)
    FROM Team t
    WHERE t.event.id IN :eventIds
    AND t.status = 'VALID'
""")
    int countValidTeams(@Param("eventIds") List<Integer> eventIds);

    @Query("""
    SELECT COUNT(t)
    FROM Team t
    WHERE t.event.id = :eventId
    AND t.status = 'VALID'
""")
    int countValidTeamsByEvent(@Param("eventId") Integer eventId);

}
