import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  buyer_reason_table: [],
  dropdown_buyerlist: [],
  dropdown_rootCause: [],
  dropdown_action: [],
  dropdown_transaction_id: [],
  temp_state_filter: {
    rootCause: "",
    action: "",
    production_Shipment: "",
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

    setFilterRootCause(state, action) {
      state.temp_state_filter.rootCause = action.payload;
    },
    setFilterAction(state, action) {
      state.temp_state_filter.action = action.payload;
    },
    setProduction_Shipment(state, action) {
      state.temp_state_filter.production_Shipment = action.payload;
    },
    resetRootCause(state) {
      state.temp_state_filter.rootCause =
        initialState.temp_state_filter.rootCause;
    },
    resetAction(state) {
      state.temp_state_filter.action = initialState.temp_state_filter.action;
    },
    resetProduction_Ship(state) {
      state.temp_state_filter.production_Shipment =
        initialState.temp_state_filter.production_Shipment;
    },
  },
});
export const {
  setBuyer_reason,
  setDropdownBuyer,
  setDropdownRootCause,
  setDropdownAction,
  setDropdownTransaction,
  setFilterRootCause,
  setFilterAction,
  setProduction_Shipment,
  resetRootCause,
  resetAction,
  resetProduction_Ship
} = buyer_reasonSlice.actions;
export default buyer_reasonSlice.reducer;
