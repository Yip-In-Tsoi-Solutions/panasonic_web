import { createSlice } from "@reduxjs/toolkit";
const initial_state = {
    goodsList: []
}
const goods_returnSlice = createSlice({
    name:"goods_return",
    initialState: initial_state,
    reducers: {
        setGoodsList (state, action) {
            state.goodsList = action.payload;
        }
    }
})
export const {setGoodsList} = goods_returnSlice.actions;
export default goods_returnSlice.reducer;