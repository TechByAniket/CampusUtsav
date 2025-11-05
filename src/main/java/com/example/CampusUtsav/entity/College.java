package com.example.CampusUtsav.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
//@Getter
//@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class College {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "college_sequence")
    @SequenceGenerator(
            name = "college_sequence",
            sequenceName = "college_sequence",
            initialValue = 1001,
            allocationSize = 1
    )
    private Integer id;

    private String username;

    @NotBlank(message = "College name is required")
    private String name;

    @NotBlank(message = "College name short form is required")
    private String shortForm;

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

    @OneToMany(mappedBy = "college", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Club> clubs;

    @ManyToMany
    @JoinTable(
            name = "college_branches",
            joinColumns = @JoinColumn(name = "college_id"),
            inverseJoinColumns = @JoinColumn(name = "branch_id")
    )
    @JsonManagedReference
    private List<Branch> branches = new ArrayList<>();

    @ElementCollection
    private Set<String> officialDomains = new HashSet<>(); // for storing official email domains of the college.(for student verification purpose)

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
