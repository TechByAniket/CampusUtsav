package com.example.CampusUtsav.repository;

import com.example.CampusUtsav.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    // ==========================================
    // GET LATEST NOTIFICATIONS FOR A USER (EXCLUDING DELETED ONES)
    // ==========================================
    List<Notification> findByRecipientUserIdAndIsDeletedFalseOrderByCreatedAtDesc(
            Long userId
    );

    // ==========================================
    // GET UNREAD NOTIFICATIONS COUNT FOR A USER
    // ==========================================
    int countByRecipientUserIdAndIsReadFalseAndIsDeletedFalse(
            Long userId
    );

    // ==========================================
    // FETCH A SPECIFIC NOTIFICATION FOR A USER
    // =========================================
    Optional<Notification> findByIdAndRecipientUserId(
            Integer notificationId,
            Long userId
    );

    // ==========================================
    // GET ALL UNREAD NOTIFICATIONS FOR A USER (EXCLUDING DELETED ONES)
    // ==========================================
    List<Notification> findByRecipientUserIdAndIsReadFalseAndIsDeletedFalse(
            Long userId
    );
}