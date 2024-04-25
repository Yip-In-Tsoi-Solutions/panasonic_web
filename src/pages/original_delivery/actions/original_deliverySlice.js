import { createSlice } from "@reduxjs/toolkit";

const initial_state = {
  suppliery_list: [],
  filterBuyer: [],
  filterVendor: [],
  filterPO: [],
  temp_state_filter: {
    buyer: "",
    vendor: "",
    purchaseNo: "",
  },
};
export const original_deliverySlice = createSlice({
  name: "original_delivery_report",
  initialState: initial_state,
  reducers: {
    setSupplieryList(state, action) {
      state.suppliery_list = action.payload;
    },
    setFilterBuyer(state, action) {
      state.filterBuyer = action.payload;
    },
    setFilterVendor(state, action) {
      state.filterVendor = action.payload;
    },
    setFilterP0(state, action) {
      state.filterPO = action.payload;
    },
    setFilterResultBuyer(state, action) {
      state.temp_state_filter.buyer = action.payload;
    },
    setFilterResultVendor(state, action) {
      state.temp_state_filter.vendor = action.payload;
    },
    setFilterResultPO(state, action) {
      state.temp_state_filter.purchaseNo = action.payload;
    },
  },
});
export const {
  setSupplieryList,
  setFilterBuyer,
  setFilterP0,
  setFilterVendor,
  setFilterResultBuyer,
  setFilterResultVendor,
  setFilterResultPO,
} = original_deliverySlice.actions;
export default original_deliverySlice.reducer;
