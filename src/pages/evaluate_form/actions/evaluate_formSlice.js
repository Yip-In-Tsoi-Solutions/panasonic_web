import { createSlice } from "@reduxjs/toolkit";
const initial_data = {
  vendor_list: [],
  evaluate_form: [],
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
  },
});
export const { setVendorList, setSelect_VendorList, setForm } =
  evaluate_formSlice.actions;
export default evaluate_formSlice.reducer;
