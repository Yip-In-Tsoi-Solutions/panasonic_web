import { configureStore } from "@reduxjs/toolkit";
import navigationSlice from "../../src/components/navigation/actions/navigationSlice";
import list_viewSlice from "../../src/components/ListViewWithDrawer/actions/list_viewSlice";
import tableActionSlice from "../../src/components/table_withActions/actions/tableActionSlice";
import supplier_deliverySlice from "../../src/pages/supplier_delivery/actions/supplier_deliverySlice";

const store = configureStore({
  reducer: {
    navigations: navigationSlice,
    table_data: tableActionSlice,
    list_view: list_viewSlice,
    original_delivery_report: supplier_deliverySlice
  }
});

export default store;
