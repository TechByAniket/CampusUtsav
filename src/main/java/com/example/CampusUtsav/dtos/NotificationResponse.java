package com.example.CampusUtsav.dtos;

import com.example.CampusUtsav.entity.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private Integer id;
    private String title;
    private String message;
    private NotificationType type;
    private boolean isRead;
    private String redirectUrl;
    private LocalDateTime createdAt;
}