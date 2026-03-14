package com.example.CampusUtsav.entity;

import com.example.CampusUtsav.entity.enums.EventCategory;
import com.example.CampusUtsav.entity.enums.EventStatus;
import com.example.CampusUtsav.entity.enums.EventType;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "unique_event_per_club_date_title",
                        columnNames = {"club_id", "normalized_title"}
                )
        }
)
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "Title is required")
    private String title;

    private String normalizedTitle;

//    @NotNull(message = "Event Category is required")
    @Enumerated(EnumType.STRING)
    private EventCategory eventCategory;

    @NotNull(message = "Event type is required")
    @Enumerated(EnumType.STRING) // stores enum as string in DB
    private EventType eventType;

    @NotBlank(message = "Description is required")
    @Column(columnDefinition = "TEXT")
    @Lob
    private String description;

    private int fees; // numeric amount

    private String posterUrl; // optional, can be blank

    @NotBlank(message = "Venue is required")
    private String venue;

    @NotNull(message = "Event date is required")
    private LocalDate date;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    private LocalDate registrationDeadline;

    private boolean teamEvent = false;
    private Integer teamSize;
//    @Min(value = 1, message = "Max participants must be at least 1")
    private int maxParticipants;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> attachments; // optional

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> tags; // optional

    @NotNull(message = "Event status is required")
    @Enumerated(EnumType.STRING)
    private EventStatus status;

    @URL(message = "Invalid URL format")
    @Column(nullable = true)
    private String registrationLink;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Map<String, String>> contactDetails;
    // optional

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String extraInfo; // optional

    @ManyToOne(fetch =FetchType.LAZY)
    @JoinColumn(name = "club_id", nullable = false)
    @NotNull(message = "Club is required")
    @JsonBackReference
    private Club club;

    private boolean isFeatured = false;
    private boolean isActive = true;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;

//    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
//    @OrderBy("timestamp ASC") // This keeps the logs in chronological order
//    private List<EventLog> approvalHistory = new ArrayList<>();
//
//    // Helper method to add a log and maintain both sides of the relationship
//    public void addLog(EventLog log) {
//        approvalHistory.add(log);
//        log.setEvent(this);
//    }

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.status = EventStatus.SUBMITTED;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}
