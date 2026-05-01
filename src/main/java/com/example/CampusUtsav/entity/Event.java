package com.example.CampusUtsav.entity;

import com.example.CampusUtsav.entity.enums.EventCategory;
import com.example.CampusUtsav.entity.enums.EventStatus;
import com.example.CampusUtsav.entity.enums.EventType;
import com.example.CampusUtsav.entity.enums.Role;
import com.example.CampusUtsav.utils.JsonToMapConverter;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;
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
import java.util.UUID;

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
    private String description;

    private int fees; // numeric amount

    private String posterUrl; // optional, can be blank

    @NotBlank(message = "Venue is required")
    private String venue;

    @NotNull(message = "Event date is required")
    @Column(name = "start_date")
    private LocalDate startDate;

    @NotNull(message = "Event date is required")
    @Column(name = "end_date")
    private LocalDate endDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    private LocalDate registrationDeadline;

    private boolean teamEvent = false;
    @Column(name = "max_team_size")
    private Integer maxTeamSize;

    @Column(name = "min_team_size")
    private Integer minTeamSize;
//    @Min(value = 1, message = "Max participants must be at least 1")
    private int maxParticipants;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "private_attachments" ,columnDefinition = "jsonb")
    @Convert(converter = JsonToMapConverter.class)
    private Map<String, Object> privateAttachments;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "public_attachments" ,columnDefinition = "jsonb")
    @Convert(converter = JsonToMapConverter.class)
    private Map<String, Object> publicAttachments;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> tags; // optional

    @NotNull(message = "Event status is required")
    @Enumerated(EnumType.STRING)
    private EventStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "pending_approval_at")
    private Role pendingApprovalAt;

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
    @JsonIgnoreProperties("events")
    @JsonBackReference
    private Club club;

    private boolean isFeatured = false;
    private boolean isActive = true;

    @Column(name = "allowed_years", columnDefinition = "int4[]")
    private List<Integer> allowedYears; // Storing years in number format

    @Column(name = "allowed_branches", columnDefinition = "int4[]")
    private List<Integer> allowedBranches; // Storing branch ids

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @OrderBy("timestamp DESC")
    private List<EventLog> approvalHistory = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime attendanceStartTime;
    private LocalDateTime attendanceEndTime;
    private boolean attendanceActive;
    private String attendanceSalt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}
