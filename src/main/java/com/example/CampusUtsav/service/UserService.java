package com.example.CampusUtsav.service;

import com.example.CampusUtsav.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserService extends JpaRepository<User, Long> {
}
