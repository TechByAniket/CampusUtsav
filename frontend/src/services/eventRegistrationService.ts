import axios from "axios";
import { handleServiceError } from "@/utils/errorUtils";

// ******** Participant(s) registration for an Event ******** //
export const registerForEvent = async (eventId: number, registrationData: any) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/events/${eventId}/register`,
      registrationData,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Registration Failed"));
  }
};


// =================================
// CANCEL EVENT REGISTRATION ( INDIVIDUAL & TEAM)
// =================================
export const cancelEventRegistration = async (registrationId: number) => {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/registrations/${registrationId}/cancel`,
            {}, 
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(handleServiceError(error, "Registration Cancellation Failed"));
    }
};