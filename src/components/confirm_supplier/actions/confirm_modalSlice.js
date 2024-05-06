import { createSlice } from "@reduxjs/toolkit";
const initial_state = {
  confirmModal: false,
  confirmBtnStatus: true
};
export const confirm_modalSlice = createSlice({
  name: "confirm",
  initialState: initial_state,
  reducers: {
    setConfirmModal(state, action) {
      state.confirmModal = action.payload;
    },
    setConfirmBtnStatus(state, action) {
        state.confirmBtnStatus = action.payload;
      },
  },
});
export const { setConfirmModal, setConfirmBtnStatus } = confirm_modalSlice.actions;
export default confirm_modalSlice.reducer;
