package com.example.CampusUtsav.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String username;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Unique identification number is required")
    @Column(unique = true)
    private String identificationNumber;

    @NotBlank(message = "Student email is required")
    @Email(message = "Invalid email format")
    @Column(unique = true)
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    @Column(unique = true)
    private String phone;

    @NotBlank(message = "password is required")
    private String passwordHash;

    @NotNull(message = "Roll number is required")
//    @Pattern(regexp = "^[A-Za-z0-9-]+$", message = "Invalid roll number format")
    private int rollNo;

    @Min(value = 1, message = "Year must be at least 1")
    @Max(value = 4, message = "Year cannot exceed 4")
    private int year;

    @NotBlank(message = "Division is required")
    @Pattern(regexp = "^[A-Za-z]+$", message = "Division must contain only letters")
    private String division;

    @Min(value = 2000, message = "Admission year must be valid")
    @Max(value = 2100, message = "Admission year must be valid")
    private int admissionYear;

    @Min(value = 2000, message = "Graduation year must be valid")
    @Max(value = 2100, message = "Graduation year must be valid")
    private int graduationYear;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean emailVerified = false;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean phoneVerified = false;

    private String verificationCode;

    private String skills;
    private String interests;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "college_id", nullable = false)
    @JsonBackReference
    private College college;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @PrePersist // Triggered automatically before a new entity is saved
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate // Triggered automatically before an existing entity is updated
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
