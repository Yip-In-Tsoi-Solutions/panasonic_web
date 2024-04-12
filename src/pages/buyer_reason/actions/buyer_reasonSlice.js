import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  buyer_reason: [],
  temp_state_filter: {
    promise_start_date: "",
    promise_end_date: "",
  },
};
const buyer_reasonSlice = createSlice({
  name: "buyer_reason",
  initialState: initialState,
  reducers: {
    setBuyer_reason(state, action) {
      state.buyer_reason = action.payload;
    },
    setFilterBuyerPromiseStart(state, action) {
      state.temp_state_filter.promise_start_date = action.payload;
    },
    setFilterBuyerPromiseEnd(state, action) {
      state.temp_state_filter.promise_end_date = action.payload;
    },
  },
});
export const { setBuyer_reason, setFilterBuyerPromiseStart, setFilterBuyerPromiseEnd } = buyer_reasonSlice.actions;
export default buyer_reasonSlice.reducer;
