package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.entity.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface CollegeRepository extends JpaRepository<College, Integer> {
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByNameIgnoreCase(String name);
    boolean existsByNormalizedName(String name);

    Optional<College> findByEmail(String email);
    Optional<College> findByUser_Id(Long userId);

}
