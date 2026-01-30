package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.entity.Club;
import com.example.CampusUtsav.entity.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubRepository extends JpaRepository<Club, Integer> {

    List<Club> findByCollege(College linkedCollege);

    Optional<Club> findByUser_Id(Long userId);
}
