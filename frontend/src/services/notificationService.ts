import axios from "axios";
import { handleServiceError } from "@/utils/errorUtils";

// ==========================================
// GET MY NOTIFICATIONS
// ==========================================
export const getMyNotifications = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notifications`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Notifications"));
  }
};

// ==========================================
// GET UNREAD COUNT OF NOTIFICATIONS
// ==========================================
export const getUnreadCount = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notifications/unread-count`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Unread Notifications Count"));
  }
};

// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================
export const markAsRead = async (notificationId: number) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/notifications/${notificationId}/read`, null, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Marking Notification as Read"));
  }
};


// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================
export const markAllAsRead = async () => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/notifications/read-all`, null, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Marking All Notification as Read"));
  }
};