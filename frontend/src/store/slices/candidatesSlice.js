import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { candidatesService } from "../../services/candidatesService";

export const fetchCandidates = createAsyncThunk("candidates/fetchAll", async (params, { rejectWithValue }) => {
  try { return (await candidatesService.getAll(params)).data; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});
export const createCandidate = createAsyncThunk("candidates/create", async (data, { rejectWithValue }) => {
  try { return (await candidatesService.create(data)).data; }
  catch (e) { return rejectWithValue(e.response?.data); }
});
export const updateCandidate = createAsyncThunk("candidates/update", async ({ id, data }, { rejectWithValue }) => {
  try { return (await candidatesService.update(id, data)).data; }
  catch (e) { return rejectWithValue(e.response?.data); }
});
export const deleteCandidate = createAsyncThunk("candidates/delete", async (id, { rejectWithValue }) => {
  try { await candidatesService.delete(id); return id; }
  catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const candidatesSlice = createSlice({
  name: "candidates",
  initialState: { items: [], total: 0, loading: false, error: null, selected: null },
  reducers: { setSelectedCandidate: (s, a) => { s.selected = a.payload; } },
  extraReducers: (b) => {
    b.addCase(fetchCandidates.pending,   (s) => { s.loading = true; s.error = null; })
     .addCase(fetchCandidates.fulfilled, (s, a) => {
        s.loading = false;
        const d = a.payload?.data;
        s.items = d?.results ?? (Array.isArray(a.payload?.data) ? a.payload.data : []);
        s.total = d?.count ?? s.items.length;
      })
     .addCase(fetchCandidates.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(deleteCandidate.fulfilled, (s, a) => { s.items = s.items.filter(i => i.id !== a.payload); });
  },
});
export const { setSelectedCandidate } = candidatesSlice.actions;
export default candidatesSlice.reducer;
