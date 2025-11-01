package com.example.CampusUtsav.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
//@Getter
//@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class College {

    @Id
    private String id;  // e.g., "3291-VJTI-MUMBAI"

    @NotBlank(message = "College name is required")
    private String name;

    @Column(unique = true)
    private String normalizedName;

    @NotBlank(message = "College admin name is required")
    private String adminName;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Website URL is required")
    @Size(max = 255, message = "Website URL too long")
    @Column(unique = true)
    private String websiteUrl;

    @NotBlank(message = "Affiliation status is required")
    private String affiliation;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Column(unique = true)
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    @Column(unique = true)
    private String phone;

    @NotBlank(message = "Password is required")
    private String passwordHash;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean emailVerified = false;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean phoneVerified = false;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String verificationCode; // For OTP or email link validation
    private String logoUrl;

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
