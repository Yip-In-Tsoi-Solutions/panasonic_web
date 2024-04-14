import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, DatePicker, Select, Table } from "antd";
import axios from "axios";
import { useForm } from "antd/es/form/Form";
import moment from "moment";
import {
  setDropdownBuyer,
  setBuyerPromiseStart,
  setBuyerPromiseEnd,
  setFilterBuyerList,
  setBuyer_reason,
} from "../actions/buyer_reasonSlice";
import schema from "../../../javascript/print_schema";
function Buyer_Reason() {
  const [form] = useForm();
  // State of Components
  const dateFormat = "DD/MM/YYYY";
  const buyer_reason = useSelector((state) => state.buyer_reason_report);
  const dispatch = useDispatch();

  // fetch api data of buyer table
  async function fetch_buyerReasonList() {
    try {
      const response = await axios.get("/api/buyerlist");
      if (response.status === 200) {
        dispatch(setBuyer_reason(response.data));
      } else {
        dispatch(setBuyer_reason(...buyer_reason?.buyer_reason_table));
      }
    } catch (error) {
      console.log(error);
    }
  }
  // fetch api data of Dropdown buyer
  async function fetchDropdownBuyer() {
    try {
      const response = await axios.get("/api/dropdown/buyer");
      response.status === 200
        ? dispatch(setDropdownBuyer(response.data))
        : dispatch(setDropdownBuyer(...buyer_reason?.dropdown_buyerlist));
    } catch (error) {
      console.log(error);
    }
  }
  // API render
  useEffect(() => {
    try {
      fetch_buyerReasonList();
      fetchDropdownBuyer();
    } catch (error) {
      console.log(error);
    }
  }, []);
  // Action of Components
  const { promise_start_date, promise_end_date, buyer } =
    buyer_reason?.temp_state_filter;
  //actions of Promise date Start
  const handlePromiseStartDate = (a, dateString) => {
    dispatch(setBuyerPromiseStart(dateString));
  };
  //actions of Promise date to
  const handlePromisetoDate = (a, dateString) => {
    dispatch(setBuyerPromiseEnd(dateString));
  };

  //actions of buyer dropdown
  const handleBuyerChange = (value) => {
    dispatch(setFilterBuyerList(value));
  };

  //actions of state
  const clearFilter = () => {
    form.resetFields();
    dispatch(setBuyerPromiseStart(""));
    dispatch(setBuyerPromiseEnd(""));
    dispatch(setFilterBuyerList(""));
  };
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold pl-0 p-3 float-left">Buyer reason</h1>
        <div className="grid grid-cols-5 gap-5 clear-both">
          <Form form={form}>
            <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
              Promise DATE FROM
            </label>
            <DatePicker
              type="date"
              format={dateFormat}
              className="w-full"
              value={
                promise_start_date !== ""
                  ? moment(promise_start_date, dateFormat)
                  : ""
              }
              onChange={handlePromiseStartDate}
            />
          </Form>
          <Form form={form}>
            <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
              Promise DATE TO
            </label>
            <DatePicker
              type="date"
              format={dateFormat}
              className="w-full"
              value={
                promise_end_date !== ""
                  ? moment(promise_end_date, dateFormat)
                  : ""
              }
              onChange={handlePromisetoDate}
            />
          </Form>
          <Form form={form}>
            <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
              Buyer
            </label>
            <Select
              value={buyer}
              onChange={handleBuyerChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              {buyer_reason?.dropdown_buyerlist.map((item) => (
                <Option key={item.Buyer} value={item.Buyer}>
                  {item.Buyer}
                </Option>
              ))}
            </Select>
          </Form>
          <Form>
            <Button
              type="button"
              onClick={clearFilter}
              className="float-left mt-7 ml-5 bg-[white] text-[black] font-bold uppercase rounded-2xl border-solid border-2 border-[black]"
            >
              clear filter
            </Button>
          </Form>
        </div>
        <div className="clear-both mt-10">
          <Table
            className="w-full overflow-y-hidden"
            dataSource={buyer_reason?.buyer_reason_table.length > 0 ? buyer_reason?.buyer_reason_table : ''}
            columns={schema(buyer_reason?.buyer_reason_table)}
          />
        </div>
      </div>
    </>
  );
}

export default Buyer_Reason;
