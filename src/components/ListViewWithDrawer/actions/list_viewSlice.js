import { createSlice } from "@reduxjs/toolkit"

const initial_state = {
    list_view: []
}
export const list_viewSlice = createSlice({
    name: 'listview',
    initialState: initial_state,
    reducers: {
        setListView(state, action) {
            state.list_view.push(action.payload)
        }
    }
})
export const {setListView} = list_viewSlice.actions;
export default list_viewSlice.reducer;