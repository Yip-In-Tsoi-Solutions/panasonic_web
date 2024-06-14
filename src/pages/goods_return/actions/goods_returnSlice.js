import { createSlice } from "@reduxjs/toolkit";
const initial_state = {
  goodsList: [],
  return_doc: [],
  temp_state_filter: {
    return_qty: "",
    cause: "",
    return_id: "",
  },
};
const goods_returnSlice = createSlice({
  name: "goods_return",
  initialState: initial_state,
  reducers: {
    setGoodsList(state, action) {
      state.goodsList = action.payload;
    },
    setReturnDoc(state, action) {
      state.return_doc.push(action.payload);
    },
    setReturnQty(state, action) {
      state.temp_state_filter.return_qty = action.payload;
    },
    setCause(state, action) {
      state.temp_state_filter.cause = action.payload;
    },
    setReturnId(state, action) {
      state.temp_state_filter.return_id = action.payload;
    },
    resetGoodsForm: (state) => {
      // Reset all state properties to their initial values
      state.temp_state_filter = initial_state.temp_state_filter;
    },
    removeDocs(state, action) {
      state.return_doc = state.return_doc.filter(item => item === action.payload);
    },
    clear_Alldocs: (state) => {
      state.return_doc = [];
    },
  },
});
export const {
  setGoodsList,
  setReturnQty,
  setCause,
  setReturnId,
  setReturnDoc,
  resetGoodsForm,
  removeDocs,
  clear_Alldocs
} = goods_returnSlice.actions;
export default goods_returnSlice.reducer;