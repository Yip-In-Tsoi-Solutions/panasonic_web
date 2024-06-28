import { Form, Select } from "antd";
import { setFilterBuyer, setFilterResultBuyer } from "../actions/filterSlice";
import { useDispatch, useSelector } from "react-redux";
import { memo, useMemo } from "react";
import axios from "axios";
const { Option } = Select;
const Buyer_filter = (props) => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.filter);
  async function fetchDropdownBuyer() {
    try {
      const response = await axios.get(`${props.baseUrl}/api/dropdown/buyer`, {
        headers: {
          Authorization: `Bearer ${props.token_id}`,
        },
      });
      response.status === 200
        ? dispatch(setFilterBuyer(response.data))
        : dispatch(setFilterBuyer(...filter?.filterBuyer));
    } catch (error) {
      if (error) {
        window.location.href='/error_login'
      }
    }
  }
  useMemo(() => {
    fetchDropdownBuyer();
  }, []);
  //actions of buyer dropdown
  const handleBuyerChange = (value) => {
    dispatch(setFilterResultBuyer(value));
  };
  return (
    <>
      <Form.Item
        className="uppercase"
        label={"Buyer"}
        name={`buyer_${props.pageTitle}`}
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
            <Option key={item.Buyer} value={item.Buyer} disabled={item.Buyer === filter.temp_state_filter.buyer}>
              {item.Buyer}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};
export default memo(Buyer_filter);
