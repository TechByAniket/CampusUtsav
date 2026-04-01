package com.example.CampusUtsav.entity;

import com.example.CampusUtsav.entity.enums.EventStatus;
import com.example.CampusUtsav.entity.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.CampusUtsav.entity.Event;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Enumerated(EnumType.STRING)
    private Role actionBy;

    @Enumerated(EnumType.STRING)
    private EventStatus action;

    @Enumerated(EnumType.STRING)
    private Role forwardedTo;

    @Enumerated(EnumType.STRING)
    private EventStatus fromStatus;

    @Enumerated(EnumType.STRING)
    private EventStatus toStatus;

    private String remarks;
    private Integer version;
    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate(){
        this.timestamp = LocalDateTime.now();
    }
}
