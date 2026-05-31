import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { applicationsService } from "../../services/applicationsService";

export const fetchApplications = createAsyncThunk("applications/fetchAll", async (params, { rejectWithValue }) => {
  try { return (await applicationsService.getAll(params)).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});
export const createApplication = createAsyncThunk("applications/create", async (data, { rejectWithValue }) => {
  try { return (await applicationsService.create(data)).data; }
  catch (e) { return rejectWithValue(e.response?.data); }
});
export const updateApplication = createAsyncThunk("applications/update", async ({ id, data }, { rejectWithValue }) => {
  try { return (await applicationsService.update(id, data)).data; }
  catch (e) { return rejectWithValue(e.response?.data); }
});

const applicationsSlice = createSlice({
  name: "applications",
  initialState: { items: [], total: 0, loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchApplications.pending,   (s) => { s.loading = true; s.error = null; })
     .addCase(fetchApplications.fulfilled, (s, a) => {
        s.loading = false;
        const d = a.payload?.data;
        s.items = d?.results ?? (Array.isArray(d) ? d : []);
        s.total = d?.count ?? s.items.length;
      })
     .addCase(fetchApplications.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
  },
});
export default applicationsSlice.reducer;
