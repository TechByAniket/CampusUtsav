package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.dtos.miniDtos.EventSummary;
import com.example.CampusUtsav.entity.Club;
import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.enums.EventStatus;
import com.example.CampusUtsav.entity.enums.Role;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    boolean existsByNormalizedTitleAndDateAndClubId(String normalizedTitle, LocalDate date, int id);

    List<Event> findByClub_Id(Integer clubId);

    @EntityGraph(attributePaths = {"club", "club.college"})
    List<Event> findByClub_College_Id(Integer collegeId);

    List<Event> findAllByStatusAndPendingApprovalAtAndClub(EventStatus status, Role pendingApprovalAt, Club currentClub);

    // ----- ADDED A COMPOSITE INDEX FOR THIS PURPOSE IN SUPABASE BY SQL QUERY ----//
        //CREATE INDEX idx_event_approval_index
        //ON event (status, pending_approval_at, club_id);
    @EntityGraph(attributePaths = {"club", "club.coordinator"})
    List<Event> findAllByClub_Coordinator_EmailAndStatusAndPendingApprovalAt(
            String email,
            EventStatus status,
            Role pendingApprovalAt
    );

    @EntityGraph(attributePaths = {"club", "club.branch"})
    List<Event> findAllByClub_College_IdAndStatusAndPendingApprovalAt(
            Integer collegeId,
            EventStatus status,
            Role pendingApprovalAt
    );

    @EntityGraph(attributePaths = {"club", "club.branch"})
    List<Event> findAllByClub_Branch_IdAndStatusAndPendingApprovalAt(Integer branchId, EventStatus status, Role pendingApprovalAt);
//    List<Event> findAllByClubIdAndStatusAndPendingApprovalAt(Integer clubId, EventStatus currentStatus, Role pendingApprovalAt);
}
