import type { Event, UpcomingEventCardProps } from "@/types/event";
import axios from "axios";
import { handleServiceError } from "@/utils/errorUtils";

// ************ GET ALL EVENT REGISTRATIONS BY EVENT ID ************ //
export const getEventRegistrations = async (eventId: number | string) =>{
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events/${eventId}/registrations`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch (error:any) {
    throw new Error(handleServiceError(error, "Fetching Event Registrations"));    
  }
}


// ************ GET EVENTS BY COLLEGE ID ************ //
export const getAllEventsByCollege = async (collegeId: number | string) =>{
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/colleges/${collegeId}/events`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch (error:any) {
    throw new Error(handleServiceError(error, "Fetching Institutional Events"));    
  }
}

// Fetch event categories and types
export const fetchEventMetaData = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events/categories-types`);
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Event Metadata"));
  }
};

export const fetchEventStatuses = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events/statuses`);
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Event Statuses"));
  }
};

// List an Event
export const createEvent = async (eventData: any, clubId: number | string) =>{
  try{
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/events/${clubId}/new-event`, eventData, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch(error:any){
    throw new Error(handleServiceError(error, "Event Creation Failed"));
  }
}


//****************** UPDATE AND RESUBMIT EVENT ******************** //
export const resubmitEvent = async (eventData: any, eventId: number | string) =>{
  try{
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/events/${eventId}/resubmit`, eventData, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch(error:any){
    throw new Error(handleServiceError(error, "Event Resubmission Failed"));
  }
}


// ***************** GET EVENT DETAILS BY EVENTID -Only for club, staff, college admin ***************** //
export const getEventDetailsByEventId = async (eventId: number | string) =>{
  try{
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events/${eventId}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch(error:any){
    throw new Error(handleServiceError(error, "Fetching Event Details"));
  }
}

// ***************** GET EVENT DETAILS BY EVENTID For Review -Only for club, staff, college admin ***************** //
export const getEventDetailsByEventIdForReview = async (eventId: number | string) =>{
  try{
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events/${eventId}/review`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch(error:any){
    throw new Error(handleServiceError(error, "Fetching Event Details"));
  }
}

// ***************** GET ALL EVENTS BY CLUB ***************** //
export const getAllEventsByClub = async (clubId: number | string) =>{
  try{
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/clubs/${clubId}/events`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch(error:any){
    throw new Error(handleServiceError(error, "Fetching Club Event Portfolio"));
  }
}

// ***************** GET PENDING EVENTS APPROVALS BY ROLE ***************** //
export const getAllPendingApprovalsByRole = async () =>{
  try{
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events/approvals/pending`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch(error:any){
    throw new Error(handleServiceError(error, "Fetching Pending Approvals"));
  }
}

// ***************** APPROVE PENDING EVENT APPROVALS BY ROLE ***************** //
export const approveEventByRole = async (eventId: number | string, remarks: string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/events/approvals/${eventId}/approve`, 
      { remarks: remarks || "" },
      {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Approval Authorization Failed"));
  }
};

// ***************** REVERT EVENT BY ROLE ***************** //
export const revertEventByRole = async (eventId: number | string, remarks: string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/events/approvals/${eventId}/revert`, 
      { remarks: remarks || "" },
      {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Reversion Command Failed"));
  }
};

// ***************** REJECT EVENT BY ROLE ***************** //
export const rejectEventByRole = async (eventId: number | string, remarks: string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/events/approvals/${eventId}/reject`, 
      { remarks: remarks || "" },
      {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Rejection Command Failed"));
  }
};

// ***************** GET REVERTED EVENTS BY CLUB ***************** //
export const getRevertedEventsByClub = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/events/approvals/reverted`,
      {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
        }
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Reverted Intel"));
  }
};


// ************************* Get Team Members Meta Data for Event Registrations **********************
export const fetchTeamMembersMetaData = async (
  identificationNumber: string
) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/student/${identificationNumber}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Partner Verification Failed"));
  }
};


// Generate AI-based event description
export const generateEventDescriptionAI = async (payload: { prompt: string;
                                                            tone: "PROFESSIONAL" | "CASUAL" | "FESTIVE";
                                                            maxLength: number;
}) => {
  try{
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/events/ai/generate`, payload,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );

  return response.data;
}
  catch(error:any){
    throw new Error(handleServiceError(error, "AI Synchronization Failed"));
  }
}

// ***************** GET EVENT APPROVAL HISTORY ***************** //
export const getEventApprovalHistory = async (eventId: number | string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/events/${eventId}/logs`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Approval History"));
  }
};
