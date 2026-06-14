import axios from "axios";
import { handleServiceError } from "@/utils/errorUtils";

// *********** GET CLUBS FOR COLLEGE PRINCIPAL ************//
export const getAllClubsForPrincipal = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/admin/clubs`,{
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return res.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Institutional Clubs"));
  }
};

// ************ UPDATE CLUB'S ACCOUNT STATUS ************ //
export const updateClubAccountStatus = async (clubId: number | string, status: string) => {
  // PATCH is best for partial updates like status
  try {
    const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/admin/clubs/${clubId}/status`, { status }, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data; 
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Updating Club Status"));
  }
};

export const registerClub = async (clubData: any, collegeId: number | string) =>{
  try{
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/public/college/${collegeId}/club/register`, clubData);
    return response.data; 
  } catch(error: any){
    throw new Error(handleServiceError(error, "Club Registration Failed"));
  }
}

export const getClubsByCollege = async (collegeId: number | string) =>{
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/public/colleges/${collegeId}/clubs`);
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching College Clubs"));
  }
}

export const getClubDetailsByClubId = async (collegeId:number, clubId:number) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/colleges/${collegeId}/clubs/${clubId}`,{
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return res.data; // whatever backend returns
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Club Profile"));
  }
};

// ******************* GET CLUB PROFILE *********************** //
export const getMyClubProfileDetails = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/club/me`,{
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return res.data; // whatever backend returns
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Profile Details"));
  }
};