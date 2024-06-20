import { createSlice } from "@reduxjs/toolkit";
const initial_data = {
  vendor_list: [],
  evaluate_form: [],
  evaluate_result_table: [],
  evaluate_pending: [],
  evaluate_confirm: [],
  temp_state_filter: {
    vendor: "",
  },
};
const evaluate_formSlice = createSlice({
  name: "evaluate",
  initialState: initial_data,
  reducers: {
    setVendorList(state, action) {
      state.vendor_list = action.payload;
    },
    setSelect_VendorList(state, action) {
      state.temp_state_filter.vendor = action.payload;
    },
    setForm(state, action) {
      state.evaluate_form = action.payload;
    },
    setEvaluateResultTable(state, action) {
      state.evaluate_result_table = action.payload;
    },
    setEvaluatePending(state, action) {
      state.evaluate_pending = action.payload;
    },
    setEvaluateConfirm(state, action) {
      state.evaluate_confirm = action.payload;
    },
    resetEValuate(state) {
      state.temp_state_filter = initial_data.temp_state_filter;
    },
  },
});
export const {
  setVendorList,
  setSelect_VendorList,
  setForm,
  setEvaluateResultTable,
  setEvaluatePending,
  setEvaluateConfirm,
  resetEValuate
} = evaluate_formSlice.actions;
export default evaluate_formSlice.reducer;
