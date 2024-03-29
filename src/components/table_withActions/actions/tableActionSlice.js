import { createSlice } from "@reduxjs/toolkit"

const initial_state = {
    dataSource: [],
    columns: []
}
export const tableActionSlice = createSlice({
    name: "table",
    initialState:initial_state,
    reducers: {
        setData(state, action) {
            state.dataSource = action.payload
        },
        setColumns(state, action) {
            state.columns = action.payload
        },
    }
})
export const {setData, setColumns} = tableActionSlice.actions;
export default tableActionSlice.reducer;