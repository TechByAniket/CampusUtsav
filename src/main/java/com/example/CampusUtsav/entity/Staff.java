package com.example.CampusUtsav.entity;

import com.example.CampusUtsav.entity.enums.AccountStatus;
import com.example.CampusUtsav.entity.enums.Designation;
import com.example.CampusUtsav.entity.enums.EventStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String email;
    private String phone;
    private String passwordHash;

    // Link Faculty to the Branch for HOD/Department logic
    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

    private String employeeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "college_id", nullable = false)
    @JsonBackReference
    private College college;

    @Enumerated(EnumType.STRING)
    private Designation designation;

    private boolean isHod;

    // Link for the first level of approval (Faculty Coordinator)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "managed_club_id") // Yeh column Staff table mein banega
    @JsonManagedReference
    private Club managedClub;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus status = AccountStatus.PENDING;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "user_id")
    private User user;

    private boolean isClubCoordinator;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

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