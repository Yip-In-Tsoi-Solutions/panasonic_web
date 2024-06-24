import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    filter_eva_month: ""
}
const summary_scoreSlice = createSlice({
    name: "summary_score",
    initialState: initialState,
    reducers: {
        setEvaMonth (state, action) {
            state.filter_eva_month = action.payload;
        }
    }
})
export const {setEvaMonth} = summary_scoreSlice.actions;
export default summary_scoreSlice.reducer;