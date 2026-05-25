package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.dtos.miniDtos.EventSummary;
import com.example.CampusUtsav.entity.Club;
import com.example.CampusUtsav.entity.Event;
import com.example.CampusUtsav.entity.enums.EventStatus;
import com.example.CampusUtsav.entity.enums.Role;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    boolean existsByNormalizedTitleAndStartDateAndClubId(String normalizedTitle, LocalDate startDate, int id);

    List<Event> findByClub_Id(Integer clubId);

    @EntityGraph(attributePaths = {"club", "club.college"})
    List<Event> findByClub_College_IdAndStatus(Integer collegeId, EventStatus status);

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


    // ---- Analytics Methods ---- //
//    @Query("SELECT c.id, COUNT(e) FROM Event e " +
//            "JOIN e.club c " +
//            "WHERE c.college.id = :collegeId " +
//            "GROUP BY c.id")
//    List<Object[]> countEventsByClubForCollege(@Param("collegeId") Integer collegeId);


    // ---- For PRINCIPAL -> Events counts of Clubs under given college ---- //
    // OUTPUT = [["CODECELL", 15L], ["CSI", 8L], ["IEEE", 12L]]
    @Query("SELECT c.shortForm, COUNT(e) FROM Event e " +
            "JOIN e.club c " +
            "WHERE c.college.id = :collegeId " +
            "GROUP BY c.shortForm")
    List<Object[]> countEventsByClubShortFormForCollege(@Param("collegeId") Integer collegeId);

    // ---- For HOD -> Events counts of Clubs under given branch ---- //
    @Query("SELECT c.shortForm, COUNT(e) FROM Event e " +
            "JOIN e.club c " +
            "WHERE c.college.id = :collegeId AND c.branch.id = :branchId " +
            "GROUP BY c.shortForm")
    List<Object[]> countEventsByClubShortFormAndBranchForCollege(
            @Param("collegeId") Integer collegeId,
            @Param("branchId") Integer branchId);

    // ---- For PRINCIPAL -> Events count by category ---- //
    @Query("SELECT e.eventCategory, COUNT(e) FROM Event e " +
            "WHERE e.club.college.id = :collegeId " +
            "GROUP BY e.eventCategory")
    List<Object[]> countEventsByCategoryForCollege(@Param("collegeId") Integer collegeId);

    // ---- For HOD -> Events count by category of their branch's clubs ---- //
    @Query("SELECT e.eventCategory, COUNT(e) FROM Event e " +
            "WHERE e.club.college.id = :collegeId AND e.club.branch.id = :branchId " +
            "GROUP BY e.eventCategory")
    List<Object[]> countEventsByCategoryForBranch(@Param("collegeId") Integer collegeId,
                                                  @Param("branchId") Integer branchId);

    // ---- For FACULTY -> Events count by category of their managed club ---- //
    @Query("SELECT e.eventCategory, COUNT(e) FROM Event e " +
            "WHERE e.club.college.id = :collegeId AND e.club.coordinator.id = :staffId " +
            "GROUP BY e.eventCategory")
    List<Object[]> countEventsByCategoryForCoordinator(@Param("collegeId") Integer collegeId,
                                                       @Param("staffId") Integer staffId);

    @Query("SELECT e.id FROM Event e WHERE e.club.id = :clubId")
    List<Integer> findEventIdsByClubId(Integer clubId);

    @Query("SELECT e.id FROM Event e WHERE e.club.branch.id = :branchId")
    List<Integer> findEventIdsByBranchId(Integer branchId);

    @Query("SELECT e.id FROM Event e WHERE e.club.college.id = :collegeId")
    List<Integer> findEventIdsByCollegeId(Integer collegeId);

    @Query("""
    SELECT COUNT(e)
    FROM Event e
    WHERE e.id IN :eventIds
    AND e.status = 'APPROVED'
    AND e.startDate > :today
""")
    int countUpcomingEvents(@Param("eventIds") List<Integer> eventIds,
                            @Param("today") LocalDate today);

    @Query("""
    SELECT COUNT(e)
    FROM Event e
    WHERE e.id IN :eventIds
    AND e.status = 'APPROVED'
    AND e.endDate < :today
""")
    int countCompletedEvents(@Param("eventIds") List<Integer> eventIds,
                             @Param("today") LocalDate today);

    @Query("""
    SELECT COUNT(e)
    FROM Event e
    WHERE e.id IN :eventIds
    AND e.status = 'APPROVED'
    AND e.startDate <= :today
    AND e.endDate >= :today
""")
    int countOngoingEvents(@Param("eventIds") List<Integer> eventIds,
                           @Param("today") LocalDate today);

    @Query("""
    SELECT COUNT(e)
    FROM Event e
    WHERE e.id IN :eventIds
    AND e.status = 'APPROVED'
""")
    int countApprovedEvents(@Param("eventIds") List<Integer> eventIds);

    @Query("""
    SELECT COUNT(e)
    FROM Event e
    WHERE e.id IN :eventIds
    AND e.status IN (
        'PENDING',
        'SUBMITTED',
        'FACULTY1_APPROVED',
        'FACULTY2_APPROVED',
        'HOD_APPROVED',
        'DEAN_APPROVED',
        'REVERTED'
    )
""")
    int countEventsUnderApproval(@Param("eventIds") List<Integer> eventIds);

    @Query("""
    SELECT e.id
    FROM Event e
    WHERE e.id IN :eventIds
    AND e.status = 'APPROVED'
    AND e.endDate < :today
""")
    List<Integer> findCompletedApprovedEventIds(
            @Param("eventIds") List<Integer> eventIds,
            @Param("today") LocalDate today
    );

    @Query("""
    SELECT MONTH(e.startDate), COUNT(e)
    FROM Event e
    WHERE e.id IN :eventIds
    AND e.status = 'APPROVED'
    GROUP BY MONTH(e.startDate)
    ORDER BY MONTH(e.startDate)
""")
    List<Object[]> countEventsMonthWise(
            @Param("eventIds") List<Integer> eventIds
    );

    @Query("""
    SELECT e.id
    FROM Event e
    WHERE e.club.id = :clubId
    AND e.status = 'APPROVED'
    AND YEAR(e.startDate) = :year
""")
    List<Integer> findApprovedEventIdsByClubAndYear(
            @Param("clubId") Integer clubId,
            @Param("year") Integer year
    );

    @Query("""
    SELECT e.id
    FROM Event e
    WHERE e.club.branch.id = :branchId
    AND e.status = 'APPROVED'
    AND YEAR(e.startDate) = :year
""")
    List<Integer> findApprovedEventIdsByBranchAndYear(
            @Param("branchId") Integer branchId,
            @Param("year") Integer year
    );

    @Query("""
    SELECT e.id
    FROM Event e
    WHERE e.club.college.id = :collegeId
    AND e.status = 'APPROVED'
    AND YEAR(e.startDate) = :year
""")
    List<Integer> findApprovedEventIdsByCollegeAndYear(
            @Param("collegeId") Integer collegeId,
            @Param("year") Integer year
    );
}
