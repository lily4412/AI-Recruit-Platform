import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { sidebarOpen: true, globalLoading: false, modal: null },
  reducers: {
    toggleSidebar:   (s) => { s.sidebarOpen = !s.sidebarOpen; },
    setGlobalLoading:(s, a) => { s.globalLoading = a.payload; },
    openModal:       (s, a) => { s.modal = a.payload; },
    closeModal:      (s) =>   { s.modal = null; },
  },
});

export const { toggleSidebar, setGlobalLoading, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
