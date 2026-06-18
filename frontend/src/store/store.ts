import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
// import dashboardReducer from "./slices/dashboardSlice"; // optional

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // collegeDashboard: collegeDashboardReducer, // optional
  },
});

// Types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
