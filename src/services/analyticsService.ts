import axios from "axios";
import { handleServiceError } from "@/utils/errorUtils";

// ==========================================
// GET EVENTS COUNT BY CLUB
// ==========================================
export const getEventsCountByClub = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/analytics/clubs/events-count`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Club Events Count"));
  }
};

// ==========================================
// GET EVENTS COUNT BY CATEGORY
// ==========================================
export const getEventsCountByCategory = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/analytics/event-categories`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Event Categories Count"));
  }
};

// ==========================================
// GET CLUB OVERVIEW ANALYTICS
// ==========================================
export const getAnalytics = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/analytics/club/overview`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Club Overview Analytics"));
  }
};

// ==========================================
// GET EVENT-SPECIFIC ANALYTICS
// ==========================================
export const getEventAnalytics = async (eventId: number | string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/analytics/event/${eventId}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Event Analytics"));
  }
};

// ==========================================
// GET TOP PERFORMING EVENTS
// ==========================================
export const getTopPerformingEvents = async (limit?: number) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/analytics/events/top-performing-events`, {
      params: limit !== undefined ? { limit } : {},
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Top Performing Events"));
  }
};

// ==========================================
// GET EVENT TRENDS
// ==========================================
export const getEventTrends = async (year?: number, clubId?: number | string) => {
  try {
    const params: Record<string, any> = {};
    if (year !== undefined) params.year = year;
    if (clubId !== undefined) params.clubId = clubId;

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/analytics/events/event-trends`, {
      params,
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Event Trends"));
  }
};
