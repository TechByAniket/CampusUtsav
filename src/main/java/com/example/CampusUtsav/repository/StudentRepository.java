package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Integer> {
}
