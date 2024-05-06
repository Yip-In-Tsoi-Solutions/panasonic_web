import { useDispatch, useSelector } from "react-redux";
import { setFilterResultVendor, setFilterVendor } from "../actions/filterSlice";
import { Form, Select } from "antd";
import { useMemo } from "react";
import axios from "axios";

const Vendor_filter = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.filter);
  async function fetchDropdownVendor() {
    try {
      const response = await axios.get("/api/dropdown/vendor");
      response.status === 200
        ? dispatch(setFilterVendor(response.data))
        : dispatch(setFilterVendor(...suppliery_list?.filterVendor));
    } catch (error) {
      console.log(error);
    }
  }
  useMemo(()=> {
    fetchDropdownVendor()
  }, [])
  //actions of vendor dropdown
  const handleVendorChange = (value) => {
    dispatch(setFilterResultVendor(value));
  };
  return (
    <>
      <Form.Item label="VENDOR" name={"VENDOR"}>
        <Select
          value={filter.temp_state_filter.vendor} // Set the value of the Select component
          onChange={handleVendorChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {filter?.filterVendor.map((item) => (
            <Option key={item.Vendor} value={item.Vendor}>
              {item.Vendor}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};
export default Vendor_filter;
