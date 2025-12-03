import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isOpen: false,
    type: "",
    config: {},
    modalData: null,
  },
  reducers: {
    openModal: (state, action) => {
      const payload = action.payload;
      state.isOpen = true;
      // allow dispatch(openModal("confirmRemoveModal")) OR openModal({ type: "confirmRemoveModal", data: {...} })
      state.type = typeof payload === "string" ? payload : payload?.type || "";
      state.modalData = typeof payload === "object" ? payload?.data ?? null : null;
      state.config = typeof payload === "object" ? payload?.config || {} : {};
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.type = "";
      state.config = {};
      state.modalData = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
