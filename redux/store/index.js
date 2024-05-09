import { configureStore } from "@reduxjs/toolkit";
import navigationSlice from "../../src/components/navigation/actions/navigationSlice";
import list_viewSlice from "../../src/components/ListViewWithDrawer/actions/list_viewSlice";
import tableActionSlice from "../../src/components/table_withActions/actions/tableActionSlice";
import buyer_reasonSlice from "../../src/pages/buyer_reason/actions/buyer_reasonSlice";
import evaluate_formSlice from "../../src/pages/evaluate_form/actions/evaluate_formSlice";
import priceReportSlice from "../../src/pages/price_report/actions/priceReportSlice";
import confirm_modalSlice from "../../src/components/confirm_supplier/actions/confirm_modalSlice";
import filterSlice from "../../src/components/filter_form/actions/filterSlice";
import goods_returnSlice from "../../src/pages/goods_return/actions/goods_returnSlice";
const store = configureStore({
  reducer: {
    navigations: navigationSlice,
    table_data: tableActionSlice,
    list_view: list_viewSlice,
    filter: filterSlice,
    confirm_supplier: confirm_modalSlice,
    buyer_reason_report: buyer_reasonSlice,
    evaluate_vendors: evaluate_formSlice,
    priceReport: priceReportSlice,
    goods_return_list: goods_returnSlice
  },
});
export default store;
