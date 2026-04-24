package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.entity.Club;
import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.entity.enums.AccountStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubRepository extends JpaRepository<Club, Integer> {

    List<Club> findByCollegeAndStatus(College college, AccountStatus status);
    List<Club> findByCollege(College college);

    Optional<Club> findByUser_Id(Long userId);

    Optional<Club> findByAdminEmail(String email);

    @Query("SELECT c.shortForm FROM Club c WHERE c.id = :clubId")
    Optional<String> findShortFormById(@Param("clubId") Long clubId);
}
