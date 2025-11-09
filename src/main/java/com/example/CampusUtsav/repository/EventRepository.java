package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    boolean existsByNormalizedTitleAndDateAndClubId(String normalizedTitle, LocalDate date, int id);
}
