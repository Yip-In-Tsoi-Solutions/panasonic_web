import { Form, Select } from "antd";
import { setFilterBuyer, setFilterResultBuyer } from "../actions/filterSlice";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import axios from "axios";
const { Option } = Select;
const Buyer_filter = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.filter);
  async function fetchDropdownBuyer() {
    try {
      const response = await axios.get("/api/dropdown/buyer");
      response.status === 200
        ? dispatch(setFilterBuyer(response.data))
        : dispatch(setFilterBuyer(...suppliery_list?.filterBuyer));
    } catch (error) {
      console.log(error);
    }
  }
  useMemo(()=> {
    fetchDropdownBuyer();
  }, [])
  //actions of buyer dropdown
  const handleBuyerChange = (value) => {
    dispatch(setFilterResultBuyer(value));
  };
  return (
    <>
      <Form.Item
        label={"Buyer"}
        name={"buyer"}
        rules={[
          {
            required: true,
            message: "Please select an Buyer",
          },
        ]}
      >
        <Select
          value={filter.temp_state_filter.buyer}
          onChange={handleBuyerChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {filter?.filterBuyer.map((item) => (
            <Option key={item.Buyer} value={item.Buyer}>
              {item.Buyer}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};
export default Buyer_filter;
