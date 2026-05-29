package com.example.CampusUtsav.service;

import com.example.CampusUtsav.dtos.NotificationResponse;
import com.example.CampusUtsav.entity.User;
import com.example.CampusUtsav.entity.enums.NotificationType;
import com.example.CampusUtsav.security.model.CustomUserDetails;

import java.util.List;

public interface NotificationService {

    // =========================
    // GET ALL NOTIFICATIONS OF CURRENT LOGGED-IN USER
    // =========================
    List<NotificationResponse> getMyNotifications(
            CustomUserDetails currentUser
    );

    // =========================
    // GET TOTAL UNREAD NOTIFICATIONS COUNT
    // =========================
    int getUnreadCount(
            CustomUserDetails currentUser
    );

    // =========================
    // MARK SINGLE NOTIFICATION AS READ
    // =========================
    void markAsRead(
            Integer notificationId,
            CustomUserDetails currentUser
    );

    // =========================
    // MARK ALL USER NOTIFICATIONS AS READ
    // =========================
    void markAllAsRead(
            CustomUserDetails currentUser
    );

    // =========================
    // CREATE AND SAVE A NEW NOTIFICATION
    // =========================
    void createNotification(
            User recipientUser,
            String title,
            String message,
            NotificationType type,
            String redirectUrl
    );
}
