
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [
    {
      key: "1",
      label: "Original Delivery Report",
    },
    {
      key: "2",
      label: "Supplier Delivery Report",
    },
    {
      key: "3",
      label: "Buyer Reason Report",
    },
    {
      key: "4",
      label: "Price Report",
    },
    {
      key: "5",
      label: "Power Bi Report",
    },
    {
      key: "6",
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
