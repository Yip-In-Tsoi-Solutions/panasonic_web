import { configureStore } from "@reduxjs/toolkit";
import navigationSlice from "../../src/components/navigation/actions/navigationSlice";
import tableSlice from "../../src/pages/powerbi_report/actions/tableSlice";
import list_viewSlice from "../../src/components/list/actions/list_viewSlice";

const store = configureStore({
  reducer: {
    navigations: navigationSlice,
    table_data: tableSlice,
    list_view: list_viewSlice
  }
});

export default store;
