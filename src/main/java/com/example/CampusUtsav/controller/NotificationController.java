package com.example.CampusUtsav.controller;

import com.example.CampusUtsav.dtos.NotificationResponse;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    // =========================
    // GET ALL NOTIFICATIONS OF CURRENT LOGGED-IN USER
    // =========================
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {

        List<NotificationResponse> response = notificationService.getMyNotifications(currentUser);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // =========================
    // GET TOTAL UNREAD NOTIFICATIONS COUNT
    // =========================
    @GetMapping("/unread-count")
    public ResponseEntity<Integer> getUnreadCount(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {

        int unreadCount = notificationService.getUnreadCount(currentUser);
        return ResponseEntity.status(HttpStatus.OK).body(unreadCount);
    }

    // =========================
    // MARK SINGLE NOTIFICATION AS READ
    // =========================
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<String> markAsRead(
            @PathVariable Integer notificationId,
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {

        notificationService.markAsRead(notificationId, currentUser);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Notification marked as read");
    }

    // =========================
    // MARK ALL NOTIFICATIONS AS READ
    // =========================
    @PutMapping("/read-all")
    public ResponseEntity<String> markAllAsRead(
            @AuthenticationPrincipal CustomUserDetails currentUser
    ) {

        notificationService.markAllAsRead(currentUser);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("All notifications marked as read");
    }

}