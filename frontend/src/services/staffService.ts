import axios from "axios";
import { handleServiceError } from "@/utils/errorUtils";

// --- FETCH ROLES ---
export const fetchAvailableRoles = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/roles`);
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Available Roles"));
  }
};

// --- FETCH ACCOUNT STATUSES ---
export const fetchAccountStatuses = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/account-statuses`);
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Account Statuses"));
  }
};

// --- FETCH STAFF MEMBERS  ---
export const fetchStaffMembers = async () =>{
  try {
    const response =await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/staff`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Staff Directory"));
  }
}

// --- UPDATE STAFF MEMBER ROLE ---
export const updateStaffRole = async (id: number | string, role: string) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/admin/staff/${id}/role`, { role }, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
        }
      });
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Updating Staff Role"));
  }
};

// --- UPDATE STAFF MEMBER STATUS ---
export const updateStaffStatus = async (id: number | string, status: string) => {
  // PATCH is best for partial updates like status
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/admin/staff/${id}/status`, { status }, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
        }
      });
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Updating Staff Status"));
  }
};

// --- UPDATE STAFF MEMBER CLUB ASSIGNMENT ---
export const updateStaffClubAssignment = async (id: number | string, clubId: number | string) => {
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/admin/staff/${id}/club`, { clubId }, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
        }
      });
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Updating Club Assignment"));
  }
};

// ********* GET STAFF PROFILE DETAILS ********** //
export const getMyStaffProfileDetails = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/staff/me`, {
      headers:{
        Authorization : `Bearer ${localStorage.getItem("token")}`
      }
    });
    return res.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Failed to fetch staff profile"));
  }
}

// --- REGISTER STAFF ---
export const registerStaff = async (data: any) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/public/staff/register`, data);
    return res.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Staff Registration Failed"));
  }
}