package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.EventLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventLogRepository extends JpaRepository<EventLog, Integer> {

    Optional<EventLog> findFirstByEventOrderByIdDesc(Event event);

    List<EventLog> findAllByEventOrderByTimestampDesc(Event event);

}
