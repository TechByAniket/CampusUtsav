package com.example.CampusUtsav.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
        name = "event_registration",
        indexes = {
                @Index(columnList = "inviteCode", name = "idx_event_registration_invite_code")
        },
        uniqueConstraints = @UniqueConstraint(columnNames = {"event_id", "student_id"})
)
public class EventRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // === Relationships ===

    // Student who registered
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    // Event being registered for
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    private String teamName;

    // === Extra registration-specific fields ===

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String extraInfo; // e.g. "Anything dynamic in event registration form"

//    @NotNull(message = "Payment status is required")
    private boolean paymentDone = false;

    @NotBlank(message = "Registration type is required")
    private String registrationType; // e.g. "individual", "team", etc.

    private Boolean attended = false;

//    @Column(unique = true, nullable = false, length = 128)
    private String inviteCode;

    private String inviteUrl;

    private LocalDateTime inviteExpiresAt;

    // === Team members for Team Events ===
    @OneToMany(mappedBy = "linkedEvent" , fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EventMemberRegistration> teamMembers;

    @Column(columnDefinition = "TEXT") //   Feedback might be long, thus using 'TEXT'
    private String feedback;

    // === Timestamps ===
    private LocalDateTime registeredAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        registeredAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}