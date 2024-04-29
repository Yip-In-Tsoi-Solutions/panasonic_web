import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { createSlice } from "@reduxjs/toolkit";
import { render } from "react-dom";

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

      label: "Evaluate Form",
    },
    {
      key: "6",
      label: `Power Bi (Admin User)`,
    },
  ],
};
export const navigationSlice = createSlice({
  name: "navigations",
  initialState,
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
    },
  },
});
export const { setItems } = navigationSlice.actions;
export default navigationSlice.reducer;
