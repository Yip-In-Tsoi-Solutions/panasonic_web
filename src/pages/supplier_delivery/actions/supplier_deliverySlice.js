import { createSlice } from "@reduxjs/toolkit";

const initial_state = {
  suppliery_list: [],
  filterPromiseDate: [],
  filterBuyer: [],
  filterVendor: [],
  filterPO: [],
  temp_state_filter: {
    promise_date: "",
    buyer: "",
    vendor: "",
    purchaseNo: "",
  },
};
export const supplier_deliverySlice = createSlice({
  name: "supplier_delivery",
  initialState: initial_state,
  reducers: {
    setSupplieryList(state, action) {
      state.suppliery_list = action.payload;
    },
    setFilterPromise_date(state, action) {
      state.filterPromiseDate = action.payload;
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
    setFilterResultPromise(state, action) {
      state.temp_state_filter.promise_date = action.payload;
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
  setFilterPromise_date,
  setFilterBuyer,
  setFilterP0,
  setFilterVendor,
  setFilterResultPromise,
  setFilterResultBuyer,
  setFilterResultVendor,
  setFilterResultPO
} = supplier_deliverySlice.actions;
export default supplier_deliverySlice.reducer;
