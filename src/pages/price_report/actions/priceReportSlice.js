import { createSlice } from "@reduxjs/toolkit";

const initial_state = {
  suppliery_list: [],
  filterBuyer: [],
  filterVendor: [],
  filterPO: [],
  temp_state_filter: {
    promise_start_date: "",
    promise_end_date: "",
    buyer: "",
    vendor: "",
    purchaseNo: "",
  },
};
export const priceReportSlice = createSlice({
  name: "supplier_delivery",
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
    setFilterResultPromiseStart(state, action) {
      state.temp_state_filter.promise_start_date = action.payload;
    },
    setFilterResultPromiseEnd(state, action) {
      state.temp_state_filter.promise_end_date = action.payload;
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
  setFilterResultPromiseStart,
  setFilterResultPromiseEnd,
  setFilterResultBuyer,
  setFilterResultVendor,
  setFilterResultPO,
} = priceReportSlice.actions;
export default priceReportSlice.reducer;
