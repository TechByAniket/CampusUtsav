import type { College } from "@/types/college";
import axios from "axios";
import { handleServiceError } from "@/utils/errorUtils";

export const getAllBranchesOfCollege = async (collegeId: number | string) =>{
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/public/colleges/${collegeId}/branches`);
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching College Branches"));    
  }
}

// ************ GET ALL REGISTERED COLLEGES ************ //
export const getAllRegisteredColleges = async () =>{
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/public/colleges`);
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Institutional Registry"));    
  }
}

// ************ GET ALL OFFICIAL DOMAINS OF COLLEGE ********** //
export const getAllOfficialDomainsOfCollege = async (collegeId: number | string) =>{
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/public/colleges/${collegeId}/official-domains`);
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Fetching Verified Domains"));    
  }
}

// ********* GET COLLEGE PROFILE DETAILS ********** //
export const getMyCollegeProfileDetails = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/college/me`, {
      headers:{
        Authorization : `Bearer ${localStorage.getItem("token")}`
      }
    });
    return res.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Failed to fetch college profile"));
  }
}

// ********* REGISTER COLLEGE ********** //
export const registerCollege = async (data: any) => {
  try {
    const { logo, collegeImg, ...rest } = data;
    
    // Split the comma-separated domains string into an array of trimmed strings
    const domainsArray = rest.officialDomains
      ? rest.officialDomains.split(',').map((d: string) => d.trim()).filter(Boolean)
      : [];

    const payload = {
      ...rest,
      officialDomains: domainsArray,
    };

    const formData = new FormData();

    // 1. Text data under 'college' as stringified JSON
    formData.append("college", JSON.stringify(payload));

    // 2. Images under 'file' key
    if (logo) {
      formData.append("file", logo);
    }
    if (collegeImg) {
      formData.append("file", collegeImg);
    }

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/public/college/register`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(handleServiceError(error, "Failed to register college"));
  }
}





export const sampleColleges: College[] = [
  {
    id: 101,
    name: "Pillai College of Engineering",
    short_form: "NIT",
    normalized_name: "national_institute_of_technology",
    admin_name: "Dr. Rajesh Kumar",
    address: "123 Main Street",
    city: "Pune",
    district: "Pune",
    state: "Maharashtra",
    affiliation: "Autonomous",
    email: "contact@nit.edu",
    email_verified: true,
    phone: "+91-9876543210",
    phone_verified: true,
    password_hash: "hashed_password_1",
    logoUrl: "/clubs/csi.png",
    username: "nitadmin",
    website_url: "https://www.nit.edu",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 1,
  },
  {
    id: 102,
    name: "Indian Institute of Science",
    short_form: "IISc",
    normalized_name: "indian_institute_of_science",
    admin_name: "Dr. Priya Sharma",
    address: "456 Science Road",
    city: "Bengaluru",
    district: "Bengaluru",
    state: "Karnataka",
    affiliation: "Autonomous",
    email: "contact@iisc.ac.in",
    email_verified: true,
    phone: "+91-9123456780",
    phone_verified: true,
    password_hash: "hashed_password_2",
    logoUrl: "https://via.placeholder.com/100x100.png?text=IISc",
    username: "iiscadmin",
    website_url: "https://www.iisc.ac.in",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: 2,
  },
];
