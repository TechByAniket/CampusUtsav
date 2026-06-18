import axios from "axios";
import { handleServiceError } from "@/utils/errorUtils";

export type Student = {
  id: number
  name: string
  gender: string
  identificationNumber: string
  email: string
  phone: string
  rollNo: number
  year: number
  division: string
  branch: string
  collegeId: number
}

export const registerStudent = async (data: any) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/student/register`, data);
    return res.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Student Registration Failed"));
  }
}

// *********** GET Student's registration details *********** //
export const getStudentRegistrations = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/me/registrations`, {
      headers:{
        Authorization : `Bearer ${localStorage.getItem("token")}`
      }
    });
    return res.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Failed to fetch your registrations"));
  }
}

// *********** GET Student's profile details *********** //
export const getMyStudentProfileDetails = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/students/me`, {
      headers:{
        Authorization : `Bearer ${localStorage.getItem("token")}`
      }
    });
    return res.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Failed to fetch student profile"));
  }
}

// *********** GET Student's profile details *********** //
export const getAllStudentsByCollege = async (collegeId: any) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/colleges/${collegeId}/students`, {
      headers:{
        Authorization : `Bearer ${localStorage.getItem("token")}`
      }
    });
    return res.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Failed to fetch students"));
  }
}



export const students: any[] = [
  {
    srNo: 1,
    regId: "REG001",
    name: "Aarav Sharma",
    collegeUid: "CUID1001",
    year: "FY",
    branch: "COMP",
    division: "A",
    rollNo: "01",
    email: "aarav.sharma@example.com",
    phone: "9876543210"
  },
  {
    srNo: 2,
    regId: "REG002",
    name: "Isha Patil",
    collegeUid: "CUID1002",
    year: "SY",
    branch: "IT",
    division: "B",
    rollNo: "12",
    email: "isha.patil@example.com",
    phone: "9876509876"
  },
  {
    srNo: 3,
    regId: "REG003",
    name: "Rohan Deshmukh",
    collegeUid: "CUID1003",
    year: "TY",
    branch: "EXTC",
    division: "A",
    rollNo: "22",
    email: "rohan.d@example.com",
    phone: "9898989898"
  },
  {
    srNo: 4,
    regId: "REG004",
    name: "Sara Khan",
    collegeUid: "CUID1004",
    year: "BE",
    branch: "AIML",
    division: "C",
    rollNo: "07",
    email: "sara.khan@example.com",
    phone: "9823456712"
  },
  {
    srNo: 5,
    regId: "REG005",
    name: "Dev Mehta",
    collegeUid: "CUID1005",
    year: "FY",
    branch: "MECH",
    division: "A",
    rollNo: "19",
    email: "dev.mehta@example.com",
    phone: "9812345600"
  },
  {
    srNo: 6,
    regId: "REG006",
    name: "Pooja Jadhav",
    collegeUid: "CUID1006",
    year: "SY",
    branch: "CIVIL",
    division: "B",
    rollNo: "05",
    email: "pooja.j@example.com",
    phone: "9871239871"
  },
  {
    srNo: 7,
    regId: "REG007",
    name: "Kunal Verma",
    collegeUid: "CUID1007",
    year: "TY",
    branch: "COMP",
    division: "A",
    rollNo: "37",
    email: "kunal.verma@example.com",
    phone: "9890001122"
  },
  {
    srNo: 8,
    regId: "REG008",
    name: "Sneha Rao",
    collegeUid: "CUID1008",
    year: "BE",
    branch: "IT",
    division: "B",
    rollNo: "28",
    email: "sneha.rao@example.com",
    phone: "9900123456"
  },
  {
    srNo: 9,
    regId: "REG009",
    name: "Aditya Kulkarni",
    collegeUid: "CUID1009",
    year: "FY",
    branch: "AIDS",
    division: "C",
    rollNo: "10",
    email: "aditya.k@example.com",
    phone: "9811112233"
  },
  {
    srNo: 10,
    regId: "REG010",
    name: "Neha Shinde",
    collegeUid: "CUID1010",
    year: "SY",
    branch: "EXTC",
    division: "A",
    rollNo: "16",
    email: "neha.shinde@example.com",
    phone: "9845671200"
  }
];
