import { configureStore } from "@reduxjs/toolkit";
import navigationSlice from "../../src/components/navigation/actions/navigationSlice";

const store = configureStore({
  reducer: {
    navigations: navigationSlice,
  }
});

export default store;
