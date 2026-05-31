import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import jobsReducer from "./slices/jobsSlice";
import candidatesReducer from "./slices/candidatesSlice";
import applicationsReducer from "./slices/applicationsSlice";

export const store = configureStore({
  reducer: {
    auth:         authReducer,
    ui:           uiReducer,
    jobs:         jobsReducer,
    candidates:   candidatesReducer,
    applications: applicationsReducer,
  },
});
