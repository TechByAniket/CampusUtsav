package com.example.CampusUtsav.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"college_id", "name", "short_form"})
        }
)
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "club_sequence")
    @SequenceGenerator(
            name = "club_sequence",
            sequenceName = "club_sequence",
            initialValue = 1001,
            allocationSize = 1
    )
    private Integer id;

    private String username;

    @NotBlank(message = "Short form is required")
    @Column(length = 20)
    private String shortForm;

    @NotBlank(message = "Club/Committee/Society/Chapter name is required")
    private String name;

    @NotBlank(message = "Admin name is required")
    private String adminName;

    @Email(message = "Invalid email format")
    @Column(unique = true)
    @NotBlank(message = "Admin email is required")
    private String adminEmail;

    //    @Column(unique = true)
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    @NotBlank(message = "Phone number (Admin) is required")
    private String adminPhone;

    @NotBlank(message = "Faculty coordinator name is required")
    private String facultyCoordinatorName;

    @NotBlank(message = "Faculty coordinator email is required")
    @Email(message = "Invalid email format")
    private String facultyCoordinatorEmail;

    @NotBlank(message = "Password is required")
    private String passwordHash;

    @NotBlank(message = "Club description is required")
    @Column(length = 1500)
    private String description;

    private String logoUrl;

//    @NotBlank(message = "Website URL is required")
    @Size(max = 255, message = "Website URL too long")
    @Column(unique = true)
    @URL(protocol = "https",
            message = "Invalid URL format")
    private String websiteUrl;

    @NotBlank(message = "Instagram Page URL is required")
    @Size(max = 255, message = "Instagram Page URL too long")
    @Column(unique = true)
    @URL(protocol = "https"
            ,host = "www.instagram.com",
            message = "Invalid URL format")
    private String instagramUrl;

//    @NotBlank(message = "LinkedIn Page URL is required")
//    @Size(max = 255, message = "LinkedIn Page URL too long")
    @Column(unique = true)
    @URL(protocol = "https",
            host = "www.linkedin.com",
            message = "Invalid URL format")
    private String linkedInUrl;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean emailVerified = false;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean phoneVerified = false;

    private String verificationCode;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "college_id", nullable = false)
    @JsonBackReference
    private College college;

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Event> events;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
