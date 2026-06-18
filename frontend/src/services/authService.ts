import axios from "axios";
import { handleServiceError } from "@/utils/errorUtils";

// ***********LOGIN AUTH SERVICE ***********
export const login = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Login Authentication Failed"));
  }
}