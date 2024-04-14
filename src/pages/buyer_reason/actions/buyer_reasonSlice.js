import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  buyer_reason_table: [],
  dropdown_buyerlist: [],
  temp_state_filter: {
    promise_start_date: "",
    promise_end_date: "",
    buyer: "",
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
    setBuyerPromiseStart(state, action) {
      state.temp_state_filter.promise_start_date = action.payload;
    },
    setBuyerPromiseEnd(state, action) {
      state.temp_state_filter.promise_end_date = action.payload;
    },
    setFilterBuyerList(state, action) {
      state.temp_state_filter.buyer = action.payload;
    },
  },
});
export const {
  setBuyer_reason,
  setDropdownBuyer,
  setBuyerPromiseStart,
  setBuyerPromiseEnd,
  setFilterBuyerList,
} = buyer_reasonSlice.actions;
export default buyer_reasonSlice.reducer;
