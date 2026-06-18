package com.example.CampusUtsav.serviceImpl;

import com.example.CampusUtsav.dtos.NotificationResponse;
import com.example.CampusUtsav.entity.Notification;
import com.example.CampusUtsav.entity.User;
import com.example.CampusUtsav.entity.enums.NotificationType;
import com.example.CampusUtsav.mapper.NotificationMapper;
import com.example.CampusUtsav.repository.NotificationRepository;
import com.example.CampusUtsav.security.model.CustomUserDetails;
import com.example.CampusUtsav.service.NotificationService;
import com.example.CampusUtsav.serviceImpl.helper.EntityLookupService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationMapper notificationMapper;
    private final NotificationRepository notificationRepository;

    // =================================
    // GET ALL NOTIFICATIONS OF CURRENT LOGGED-IN USER
    // =================================
    @Override
    public List<NotificationResponse> getMyNotifications(
            CustomUserDetails currentUser
    ) {

        Long userId = currentUser.getUser().getId();

        List<Notification> notifications =
                notificationRepository
                        .findByRecipientUserIdAndIsDeletedFalseOrderByCreatedAtDesc(userId);

        return notifications.stream()
                .map(NotificationMapper::toResponse)
                .toList();
    }

    // =================================
    // GET TOTAL UNREAD NOTIFICATIONS COUNT
    // =================================
    @Override
    public int getUnreadCount(
            CustomUserDetails currentUser
    ) {

        Long userId = currentUser.getUser().getId();

        return notificationRepository
                .countByRecipientUserIdAndIsReadFalseAndIsDeletedFalse(userId);
    }

    // =================================
    // MARK SINGLE NOTIFICATION AS READ
    // =================================
    @Override
    public void markAsRead(
            Integer notificationId,
            CustomUserDetails currentUser
    ) {

        Long userId = currentUser.getUser().getId();

        Notification notification =
                notificationRepository
                        .findByIdAndRecipientUserId(notificationId, userId)
                        .orElseThrow(() ->
                                new RuntimeException("Notification not found")
                        );

        notification.setRead(true);

        notificationRepository.save(notification);
    }

    // =================================
    // MARK ALL USER NOTIFICATIONS AS READ
    // =================================
    @Override
    public void markAllAsRead(
            CustomUserDetails currentUser
    ) {

        Long userId = currentUser.getUser().getId();

        List<Notification> notifications =
                notificationRepository
                        .findByRecipientUserIdAndIsReadFalseAndIsDeletedFalse(userId);

        notifications.forEach(notification ->
                notification.setRead(true)
        );

        notificationRepository.saveAll(notifications);
    }

    // =================================
    // CREATE AND SAVE A NEW NOTIFICATION
    // =================================
    @Override
    public void createNotification(
            User recipientUser,
            String title,
            String message,
            NotificationType type,
            String redirectUrl
    ) {
        Notification notification = notificationMapper.toEntity(
                recipientUser,
                title,
                message,
                type,
                redirectUrl
        );

        notificationRepository.save(notification);
    }

}
