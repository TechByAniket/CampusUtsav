package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Integer> {
    Optional<Branch> findByNameIgnoreCase(String branchName);
}
