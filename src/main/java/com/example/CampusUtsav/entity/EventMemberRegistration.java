package com.example.CampusUtsav.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "event_member_registration", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"registration_id", "student_id"}, name = "uk_registration_student")
})
public class EventMemberRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", nullable = false)
    private EventRegistration linkedEvent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    private boolean isLeader = false;

    private LocalDateTime joinedAt;

    @PrePersist
    protected void onCreate(){
        joinedAt = LocalDateTime.now();
    }
}
