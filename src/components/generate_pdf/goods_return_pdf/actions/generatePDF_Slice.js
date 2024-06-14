import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  supplier: [],
  previewSampleData: [],
  temp_state_filter: {
    supplierName: "",
    invoice_date: "",
    return_id: "",
  },
};
const generatePDF_Slice = createSlice({
  name: "generate_pdf",
  initialState: initialState,
  reducers: {
    setSupplier(state, action) {
      state.supplier = action.payload;
    },
    setSampleData(state, action) {
      state.previewSampleData = action.payload;
    },
    setSupplierNameFilter(state, action) {
      state.temp_state_filter.supplierName = action.payload;
    },
    setInvoice_date(state, action) {
      state.temp_state_filter.invoice_date = action.payload;
    },
    setReturnId(state, action) {
      state.temp_state_filter.return_id = action.payload;
    },
    resetSlice(state) {
      state.temp_state_filter = initialState.temp_state_filter;
    },
  },
});
export const {
  setSupplier,
  setSampleData,
  setSupplierNameFilter,
  setInvoice_date,
  setReturnId,
  resetSlice,
} = generatePDF_Slice.actions;
export default generatePDF_Slice.reducer;
