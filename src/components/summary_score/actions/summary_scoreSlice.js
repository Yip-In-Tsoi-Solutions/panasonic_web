import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  filter_eva_month: "",
  evaluated_list: [],
};
const summary_scoreSlice = createSlice({
  name: "summary_score",
  initialState: initialState,
  reducers: {
    setEvaMonth(state, action) {
      state.filter_eva_month = action.payload;
    },
    setEvaluated_list(state, action) {
      state.evaluated_list = action.payload;
    },
    resetSummaryScore: (state) => {
      return initialState
    },
  },
});
export const { setEvaMonth, setEvaluated_list, resetSummaryScore } = summary_scoreSlice.actions;
export default summary_scoreSlice.reducer;
