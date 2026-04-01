package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.entity.College;
import com.example.CampusUtsav.entity.Staff;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {

    Optional<Staff> findByUser_Email(String email);
    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
    boolean existsByEmployeeId(String employeeId);

    boolean existsByBranchIdAndCollegeIdAndIsHodTrue(Integer branchId, Integer collegeId);

    Optional<Staff> findByEmail(String email);

    Optional<Staff> findByBranchIdAndCollegeIdAndIsHodTrue(Integer branchId, Integer collegeId);

    Optional<Staff> findByManagedClubIdAndCollegeId(Integer clubId, Integer collegeId);

    Integer countByBranchIdAndCollegeIdAndIsHodTrue(Integer branchId, Integer collegeId);

    Integer countByManagedClubIdAndCollegeIdAndIdNot(Integer clubId, Integer collegeId, Integer staffId);

    Optional<Staff> findByUser_Id(Long userId);

    // ---- NO NEED TO USE OPTIONAL here, because by default list handles null, it can be empty ----//
    // ---- You should use Optional only when you are fetching a single object by ID or unique field. ----//
    // - ENTITYGRAPH is used for database optimizations and to solve N+1 Query problem - //
    @EntityGraph(attributePaths = {"branch", "managedClub"})
    List<Staff> findAllByCollegeId(Integer collegeId);
}
