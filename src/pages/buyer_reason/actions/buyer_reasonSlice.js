import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  buyer_reason_table: [],
  dropdown_buyerlist: [],
  dropdown_rootCause: [],
  dropdown_action: [],
  dropdown_transaction_id: [],
  temp_state_filter: {
    promise_start_date: "",
    promise_end_date: "",
    buyer: "",
    vendor: "",
    rootCause: "",
    action: "",
    production_Shipment: ""
  },
};
const buyer_reasonSlice = createSlice({
  name: "buyer_reason",
  initialState: initialState,
  reducers: {
    setBuyer_reason(state, action) {
      state.buyer_reason_table = action.payload;
    },
    setDropdownBuyer(state, action) {
      state.dropdown_buyerlist = action.payload;
    },
    setDropdownRootCause(state, action) {
      state.dropdown_rootCause = action.payload;
    },
    setDropdownAction(state, action) {
      state.dropdown_action = action.payload;
    },
    setDropdownTransaction(state, action) {
      state.dropdown_transaction_id = action.payload;
    },
    setBuyerPromiseStart(state, action) {
      state.temp_state_filter.promise_start_date = action.payload;
    },
    setBuyerPromiseEnd(state, action) {
      state.temp_state_filter.promise_end_date = action.payload;
    },
    setFilterBuyerList(state, action) {
      state.temp_state_filter.buyer = action.payload;
    },
    setFilterVendorList(state, action) {
      state.temp_state_filter.vendor = action.payload;
    },
    setFilterRootCause(state, action) {
      state.temp_state_filter.rootCause = action.payload;
    },
    setFilterAction(state, action) {
      state.temp_state_filter.action = action.payload;
    },
    setProduction_Shipment(state, action) {
      state.temp_state_filter.production_Shipment = action.payload;
    },
  },
});
export const {
  setBuyer_reason,
  setDropdownBuyer,
  setDropdownRootCause,
  setDropdownAction,
  setDropdownTransaction,
  setBuyerPromiseStart,
  setBuyerPromiseEnd,
  setFilterBuyerList,
  setFilterVendorList,
  setFilterRootCause,
  setFilterAction,
  setProduction_Shipment
} = buyer_reasonSlice.actions;
export default buyer_reasonSlice.reducer;
