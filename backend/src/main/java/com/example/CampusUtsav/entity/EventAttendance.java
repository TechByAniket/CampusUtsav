package com.example.CampusUtsav.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"event_id", "student_id"})
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // =========================
    // Event
    // =========================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    // =========================
    // Student
    // =========================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    // =========================
    // Attendance flag
    // =========================
    private boolean present = true;

    // =========================
    // Timestamp
    // =========================
    private LocalDateTime markedAt;

    @PrePersist
    protected void onMarked(){
        this.markedAt = LocalDateTime.now();
    }
}
