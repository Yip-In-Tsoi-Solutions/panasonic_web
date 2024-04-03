import { createSlice } from "@reduxjs/toolkit"

const initial_state = {
    suppliery_list: []
}
export const supplier_deliverySlice = createSlice({
    name: 'supplier_delivery',
    initialState: initial_state,
    reducers: {
        setSupplieryList (state, action) {
            state.suppliery_list = action.payload
        }
    }
})
export const {setSupplieryList} = supplier_deliverySlice.actions;
export default supplier_deliverySlice.reducer;