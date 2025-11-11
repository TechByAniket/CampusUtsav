package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.entity.User;
import com.example.CampusUtsav.entity.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    // find users by referenceId and role (helpful for linking)
    Optional<User> findByReferenceIdAndRole(Long referenceId, Role role);
}
