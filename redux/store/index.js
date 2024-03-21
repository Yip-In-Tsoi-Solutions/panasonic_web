import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "../../src/pages/supplier_delivery/actions/counterSlice";

const store = configureStore({
  reducer: {
    counter: counterSlice,
  }
});

export default store;
