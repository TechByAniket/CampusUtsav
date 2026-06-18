import axios from "axios";
import { handleServiceError } from "@/utils/errorUtils";

// =================================
// ADD TEAM MEMBER 
// =================================
export const addMember = async (teamId: number, studentId: number) => {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/teams/${teamId}/add-member/${studentId}`,
            {},
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(handleServiceError(error, "Team Member Addition Failed"));
    }
}


// =================================
// GET TEAM MEMBERS
// =================================
export const getTeamMembers = async (teamId: number) => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/teams/${teamId}/members`,
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(handleServiceError(error, "Team Member Fetching Failed"));
    }
}


// =================================
// LEAVE TEAM
// =================================
export const leaveTeam = async (teamMemberId: number) => {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/team-members/${teamMemberId}/leave`,
            {},
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(handleServiceError(error, "Failed to Leave Team"));
    }
}


// =================================
// REMOVE TEAM MEMBER BY LEADER
// =================================
export const removeMember = async (teamMemberId: number) => {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/team-members/${teamMemberId}/remove`,
            {},
            {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(handleServiceError(error, "Failed to Delete Team"));
    }
}
