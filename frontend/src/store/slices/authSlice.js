import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";

export const loginUser = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const res = await authService.login(credentials);
    const { access, refresh, user } = res.data.data;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    return { access, refresh, user };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async (_, { getState }) => {
  const refresh = localStorage.getItem("refresh_token");
  try { await authService.logout({ refresh }); } catch (_) {}
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:         null,
    accessToken:  localStorage.getItem("access_token") || null,
    refreshToken: localStorage.getItem("refresh_token") || null,
    loading:      false,
    error:        null,
  },
  reducers: {
    setUser(state, action) { state.user = action.payload; },
    clearAuth(state) {
      state.user = null; state.accessToken = null; state.refreshToken = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.loading = false; s.accessToken = a.payload.access;
        s.refreshToken = a.payload.refresh; s.user = a.payload.user;
      })
      .addCase(loginUser.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(logoutUser.fulfilled,(s) => { s.user = null; s.accessToken = null; s.refreshToken = null; });
  },
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
