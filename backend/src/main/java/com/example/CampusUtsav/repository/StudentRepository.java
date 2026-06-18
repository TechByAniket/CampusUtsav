package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Integer> {
    // findByUser -> go to user entity in student table.
    // _ -> get inside that user object.
    // Id -> get the id of the object.
    Optional<Student> findByUser_Id(Long userId);
    Optional<List<Student>> findByCollege_Id(Integer collegeId);
    Optional<Student> findByIdentificationNumber(String identificationNumber);

}
