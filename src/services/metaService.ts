import { handleServiceError } from "@/utils/errorUtils";
import axios from "axios";

// =================================
// GET REGISTRATION META
// =================================
export const getRegistrationMeta = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/public/meta/registrations`);
        return res.data;
    } catch (error: any) {
        throw new Error(handleServiceError(error, "Fetching Registration Meta"));
    }
}   


// =================================
// GET TEAMS META
// =================================
export const getTeamMeta = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/public/meta/teams`);
        return res.data;
    } catch (error: any) {
        throw new Error(handleServiceError(error, "Fetching Team Meta Data"));
    }
}


// =================================
// GET STAFF DESIGNATIONS META
// =================================
export const getStaffDesignationsMeta = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/public/meta/staff-designations`);
        return res.data;
    } catch (error: any) {
        throw new Error(handleServiceError(error, "Fetching Staff Designations"));
    }
}

// ================================
// GET ALL REGISTERED BRANCHES 
// ================================
export const getBranches = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/public/meta/branches`);
    return res.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Branches"));
  }
}