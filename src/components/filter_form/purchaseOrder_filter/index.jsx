import { Form, Select } from "antd";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilterP0, setFilterResultPO } from "../actions/filterSlice";
import axios from "axios";

const PurchaseOrder_filter = () => {
    const dispatch = useDispatch();
  const filter = useSelector((state) => state.filter);

  async function fetchDropdownPoNumber() {
    try {
      const response = await axios.get("http://localhost:8080/api/dropdown/po_number");
      response.status === 200
        ? dispatch(setFilterP0(response.data))
        : dispatch(setFilterP0(...filter?.filterPO));
    } catch (error) {
      console.log(error);
    }
  }
  useMemo(()=> {
    fetchDropdownPoNumber();
  }, [])
  //actions of purchase order dropdown
  const handlePOChange = (value) => {
    dispatch(setFilterResultPO(value));
  };
  return (
    <>
      <Form.Item label="PO Numbers" name={"PO Numbers"}>
        <Select
          value={filter.temp_state_filter.purchaseNo} // Set the value of the Select component
          onChange={handlePOChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {filter?.filterPO.map((item) => (
            <Option key={item.po_no} value={item.po_no}>
              {item.po_no}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};
export default PurchaseOrder_filter;
