package com.example.CampusUtsav.mapper;

import com.example.CampusUtsav.dtos.NotificationResponse;
import com.example.CampusUtsav.entity.Notification;
import com.example.CampusUtsav.entity.User;
import com.example.CampusUtsav.entity.enums.NotificationType;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class NotificationMapper {

    public Notification toEntity(
            User recipientUser,
            String title,
            String message,
            NotificationType type,
            String redirectUrl
    ) {
        return Notification.builder()
                .recipientUser(recipientUser)
                .title(title)
                .message(message)
                .type(type)
                .redirectUrl(redirectUrl)
                .isRead(false)
                .isDeleted(false)
                .build();
    }

    public static NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.isRead())
                .redirectUrl(notification.getRedirectUrl())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
