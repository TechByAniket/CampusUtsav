import { handleServiceError } from "@/utils/errorUtils";
import axios from "axios";

// ********* START ATTENDANCE ********** //
export const startAttendance = async (eventId: string | number) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/events/${eventId}/attendance/start`, {}, {
      headers:{
        Authorization : `Bearer ${localStorage.getItem("token")}`
      }
    });
    return res.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Failed to start attendance"));
  }
}

// ********* STATUS OF ATTENDANCE ********** //
export const getEventAttendanceStatus = async (eventId: string | number) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events/${eventId}/attendance/status`, {
      headers:{
        Authorization : `Bearer ${localStorage.getItem("token")}`
      }
    });
    return res.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Failed to fetch attendance status"));
  }
}

// ********* STOP ATTENDANCE ********** //
export const stopAttendance = async (eventId: string | number) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/events/${eventId}/attendance/stop`, {}, {
      headers:{
        Authorization : `Bearer ${localStorage.getItem("token")}`
      }
    });
    return res.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Failed to stop attendance"));
  }
}

// ********* GET EVENT ATTENDANCE ********** //
export const getEventAttendance = async (eventId: string | number) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events/${eventId}/attendance`, {
      headers:{
        Authorization : `Bearer ${localStorage.getItem("token")}`
      }
    });
    return res.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Failed to fetch event attendance"));
  }
}

// ********* GET ATTENDANCE TOKEN ********** //
export const getAttendanceToken = async (eventId: string | number) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events/${eventId}/attendance/token`, {
      headers:{
        Authorization : `Bearer ${localStorage.getItem("token")}`
      }
    });
    return res.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Failed to fetch attendance token"));
  }
}

// ********* MARK ATTENDANCE ********** //
export const markAttendance = async (attendanceToken: string) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/events/attendance/scan`, { attendanceToken }, {
      headers:{
        Authorization : `Bearer ${localStorage.getItem("token")}`
      }
    });
    return res.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Failed to mark attendance"));
  }
}