import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* =======================
   Types
======================= */

interface StudentSummary {
  id: number;
  name: string;
  email: string;
  rollNo: string;
  year: string;
  branch: string;
}

interface AuthState {
  token: string | null;
  role: string | null;
  email: string | null;
  profileId: number | null;
  collegeId: number | null;
  collegeName: string | null;

  // role-based optional data
  studentSummary: StudentSummary | null;
}

/* =======================
   LocalStorage helper
======================= */

const persistAuth = (state: AuthState) => {
  Object.entries(state).forEach(([key, val]) => {
    if (val === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(
        key,
        typeof val === "object" ? JSON.stringify(val) : String(val)
      );
    }
  });
};

/* =======================
   Initial State
======================= */

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role"),
  email: localStorage.getItem("email"),
  profileId: localStorage.getItem("profileId")
    ? Number(localStorage.getItem("profileId"))
    : null,
  collegeId: localStorage.getItem("collegeId")
    ? Number(localStorage.getItem("collegeId"))
    : null,
  collegeName: localStorage.getItem("collegeName"),
  studentSummary: localStorage.getItem("studentSummary")
    ? JSON.parse(localStorage.getItem("studentSummary") as string)
    : null,
};

/* =======================
   Slice
======================= */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      {
        payload,
      }: PayloadAction<{
        token: string;
        role: string;
        email: string;
        profileId: number;
        collegeId: number;
        collegeName?: string | null;
        studentSummary?: StudentSummary | null;
      }>
    ) => {
      state.token = payload.token;
      state.role = payload.role;
      state.email = payload.email;
      state.profileId = payload.profileId;
      state.collegeId = payload.collegeId;
      state.collegeName = payload.collegeName ?? null;
      state.studentSummary = payload.studentSummary ?? null;

      persistAuth(state);
    },

    logout: (state) => {
      state.token = null;
      state.role = null;
      state.email = null;
      state.profileId = null;
      state.collegeId = null;
      state.collegeName = null;
      state.studentSummary = null;

      persistAuth(state);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
