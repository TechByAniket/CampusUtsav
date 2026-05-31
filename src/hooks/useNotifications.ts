import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyNotifications, getUnreadCount, markAsRead, markAllAsRead } from "@/services/notificationService";

export interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  redirectUrl: string;
  createdAt: string;
}

export const checkIfUnread = (n: any): boolean => {
  if (!n) return true;
  // Support both 'isRead' and 'read' field names due to Jackson serialization quirks
  const isRead = n.isRead !== undefined ? n.isRead : n.read;
  
  if (isRead === undefined || isRead === null) return true;
  if (typeof isRead === "boolean") return !isRead;
  if (typeof isRead === "number") return isRead === 0;
  if (typeof isRead === "string") {
    const normalized = isRead.trim().toLowerCase();
    return normalized === "false" || normalized === "0" || normalized === "";
  }
  return !isRead;
};

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // 1. Get My Notifications
  const { data = [], isLoading, error, refetch: refetchNotifications } = useQuery<NotificationResponse[]>({
    queryKey: ["notifications"],
    queryFn: getMyNotifications,
    staleTime: 30000, // 30s cache
    enabled: !!token,
  });

  const notifications = Array.isArray(data) ? data : [];

  // 2. Get Unread Count
  const { data: unreadCountData, refetch: refetchUnreadCount } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    staleTime: 30000,
    enabled: !!token,
  });

  // Safe parsing for count, handling both number directly or wrapping objects
  const unreadCount = typeof unreadCountData === "number"
    ? unreadCountData
    : (unreadCountData?.count ?? unreadCountData?.unreadCount ?? 0);

  // 3. Mark Single Notification as Read
  const markSingleAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData<NotificationResponse[]>(["notifications"], (old) => {
        if (!old) return [];
        return old.map((n) => (String(n.id) === String(notificationId) ? { ...n, isRead: true, read: true } : n));
      });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  // 4. Mark All Notifications as Read
  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.setQueryData<NotificationResponse[]>(["notifications"], (old) => {
        if (!old) return [];
        return old.map((n) => ({ ...n, isRead: true, read: true }));
      });
      queryClient.setQueryData(["notifications", "unread-count"], 0);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead: markSingleAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    isMarkingRead: markSingleAsReadMutation.isPending,
    isMarkingAllRead: markAllAsReadMutation.isPending,
    refetchNotifications,
    refetchUnreadCount,
  };
};
