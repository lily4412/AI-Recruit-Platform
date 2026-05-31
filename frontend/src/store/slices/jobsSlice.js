import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jobsService } from "../../services/jobsService";

export const fetchJobs = createAsyncThunk("jobs/fetchAll", async (params, { rejectWithValue }) => {
  try { return (await jobsService.getAll(params)).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});
export const createJob = createAsyncThunk("jobs/create", async (data, { rejectWithValue }) => {
  try { return (await jobsService.create(data)).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});
export const updateJob = createAsyncThunk("jobs/update", async ({ id, data }, { rejectWithValue }) => {
  try { return (await jobsService.update(id, data)).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});
export const deleteJob = createAsyncThunk("jobs/delete", async (id, { rejectWithValue }) => {
  try { await jobsService.delete(id); return id; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const jobsSlice = createSlice({
  name: "jobs",
  initialState: { items: [], total: 0, loading: false, error: null, selected: null },
  reducers: { setSelected: (s, a) => { s.selected = a.payload; } },
  extraReducers: (b) => {
    b.addCase(fetchJobs.pending,   (s) => { s.loading = true; s.error = null; })
     .addCase(fetchJobs.fulfilled, (s, a) => {
        s.loading = false;
        const d = a.payload?.data;
        s.items = d?.results ?? (Array.isArray(a.payload?.data) ? a.payload.data : []);
        s.total = d?.count ?? s.items.length;
      })
     .addCase(fetchJobs.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(deleteJob.fulfilled, (s, a) => { s.items = s.items.filter(i => i.id !== a.payload); });
  },
});
export const { setSelected: setSelectedJob } = jobsSlice.actions;
export default jobsSlice.reducer;
