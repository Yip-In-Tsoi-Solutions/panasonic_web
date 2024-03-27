
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  items: [
    {
      key: "1",
      label: "Supplier Delivery",
    },
    {
      key: "2",
      label: "Buyer Reason",
    },
    {
      key: "3",
      label: "Price Report",
    },
    {
      key: "4",
      label: "Power Bi Report",
    },
    {
      key: "5",
      label: "Evaluate Form",
    },
  ]
};
export const navigationSlice = createSlice({
  name: "navigations",
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
    }
  },
});
export const { setItems } = navigationSlice.actions;
export default navigationSlice.reducer;
