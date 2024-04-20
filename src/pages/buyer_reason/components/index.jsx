import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Form,
  DatePicker,
  Select,
  Table,
  Drawer,
  Input,
  Tag,
} from "antd";
import axios from "axios";
import { useForm } from "antd/es/form/Form";
import moment from "moment";
import {
  setDropdownBuyer,
  setBuyerPromiseStart,
  setBuyerPromiseEnd,
  setFilterBuyerList,
  setBuyer_reason,
  setDropdownRootCause,
  setFilterRootCause,
  setDropdownTransaction,
  setDropdownAction,
  setFilterAction,
} from "../actions/buyer_reasonSlice";
import schema from "../../../javascript/print_schema";
function Buyer_Reason() {
  const [form] = useForm();
  // State of Components
  const dateFormat = "DD/MM/YYYY";
  const [openUpdateForm, setUpdateForm] = useState(false);
  const buyer_reason = useSelector((state) => state.buyer_reason_report);
  const [current_selected, setCurrentSelected] = useState({
    promiseDate: "",
    vendor: "",
    transaction_id: "",
  });
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
  // fetch api data of Dropdown Root-cause
  async function fetchDropdownRootCause() {
    try {
      const response = await axios.get("/api/dropdown/root_cause");
      response.status === 200
        ? dispatch(setDropdownRootCause(response.data))
        : dispatch(setDropdownRootCause(...buyer_reason?.dropdown_rootCause));
    } catch (error) {
      console.log(error);
    }
  }
  // fetch api data of Dropdown Action
  async function fetchDropdownAction() {
    try {
      const response = await axios.get("/api/dropdown/actions");
      response.status === 200
        ? dispatch(setDropdownAction(response.data))
        : dispatch(setDropdownAction(...buyer_reason?.dropdown_action));
    } catch (error) {
      console.log(error);
    }
  }
  // fetch api data of Dropdown transaction_id
  async function fetchDropdownTransaction_id() {
    try {
      const response = await axios.get("/api/dropdown/transaction_id");
      response.status === 200
        ? dispatch(setDropdownTransaction(response.data))
        : dispatch(
            setDropdownTransaction(...buyer_reason?.dropdown_transaction_id)
          );
    } catch (error) {
      console.log(error);
    }
  }
  // API render
  useMemo(() => {
    try {
      fetch_buyerReasonList();
      fetchDropdownBuyer();
      fetchDropdownRootCause();
      fetchDropdownAction();
      fetchDropdownTransaction_id();
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
  const handleRootCauseChange = (value) => {
    dispatch(setFilterRootCause(value));
  };
  const handleActionChange = (value) => {
    dispatch(setFilterAction(value));
  };
  //actions of state
  const clearFilter = () => {
    form.resetFields();
    dispatch(setBuyer_reason([]));
    dispatch(setBuyerPromiseStart(""));
    dispatch(setBuyerPromiseEnd(""));
    dispatch(setFilterBuyerList(""));
    //dispatch(setFilterRootCause(""));
  };
  const updateReason = (item) => {
    setUpdateForm(true);
    const { promise_date, Vendor, T_ID } = item;
    setCurrentSelected({
      promiseDate: promise_date,
      vendor: Vendor,
      transaction_id: T_ID,
    });
  };
  const manageFilter = async () => {
    let queryString = "";
    if (buyer != "") {
      queryString += `AND [Buyer] = ${JSON.stringify(buyer).replace(
        /"/g,
        "'"
      )}`;
    }
    if (promise_start_date != "" && promise_end_date != "") {
      queryString += ` AND [Promise Date] BETWEEN ${JSON.stringify(
        promise_start_date
      ).replace(/"/g, "'")} AND ${JSON.stringify(promise_end_date).replace(
        /"/g,
        "'"
      )}`;
    }
    const response = await axios.post("/api/buyerlist_filter_optional", {
      queryString,
    });
    if (response.status === 200) {
      dispatch(setBuyer_reason(response.data));
    } else {
      dispatch(setBuyer_reason(...buyer_reason?.buyer_reason_table));
    }
  };
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold pl-0 p-3 float-left">Buyer reason</h1>

        <Form
          onFinish={manageFilter}
          form={form}
          className="grid grid-cols-5 gap-5 clear-both"
        >
          <Form.Item>
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
          </Form.Item>
          <Form.Item>
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
          </Form.Item>
          <Form.Item>
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
          </Form.Item>
          <Form.Item>
            <div className="flex flex-row mt-7">
              <Button htmlType="submit" className="uppercase ml-2">
                <div className="flex flex-row">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 float-left mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                    />
                  </svg>
                  Filter
                </div>
              </Button>
              <Button onClick={clearFilter} className="uppercase ml-5">
                <div className="flex flex-row">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 float-left mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                  Clear Filter
                </div>
              </Button>
            </div>
          </Form.Item>
        </Form>
        <div className="clear-both mt-10">
          <Table
            className="w-full overflow-y-hidden"
            dataSource={
              buyer_reason?.buyer_reason_table.length > 0
                ? buyer_reason?.buyer_reason_table
                : ""
            }
            columns={schema(buyer_reason?.buyer_reason_table).concat([
              {
                title: "Action",
                key: "action",
                render: (record) => (
                  <Button
                    onClick={updateReason.bind(this, record)}
                    className="uppercase"
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      boxShadow: "none",
                    }}
                  >
                    <div className="flex flex-row">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>

                      <p className="ml-5">Reason</p>
                    </div>
                  </Button>
                ),
              },
            ])}
          />
          <Drawer
            title="REASON UPDATE"
            onClose={() => setUpdateForm(false)}
            open={openUpdateForm}
            width={window.innerWidth / 1.5}
          >
            <h1 className="italic uppercase">Current data</h1>
            <div className="grid grid-cols-3 gap-3 clear-both">
              <Form form={form}>
                <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
                  promise date
                </label>
                <Input
                  value={current_selected?.promiseDate}
                  className="border-2 border-[#006254]"
                />
              </Form>
              <Form form={form}>
                <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
                  vendor
                </label>
                <Input
                  value={current_selected?.vendor}
                  className="border-2 border-[#006254]"
                />
              </Form>
              <Form form={form}>
                <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
                  transaction_id
                </label>
                <Input
                  value={current_selected?.transaction_id}
                  className="border-2 border-[#006254]"
                />
              </Form>
            </div>
            <br />
            <h1 className="italic uppercase">update Information</h1>
            <div className="grid grid-cols-2 gap-2 clear-both">
              <Form form={form}>
                <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
                  root-cause
                </label>
                <Select
                  value={buyer_reason?.temp_state_filter?.rootCause}
                  onChange={handleRootCauseChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  {buyer_reason?.dropdown_rootCause.map((item) => (
                    <Option key={item.case} value={item.case}>
                      {item.case}
                    </Option>
                  ))}
                </Select>
              </Form>

              <Form form={form}>
                <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
                  action
                </label>
                <Select
                  value={buyer_reason?.temp_state_filter?.action}
                  onChange={handleActionChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  {buyer_reason?.dropdown_action.map((item) => (
                    <Option key={item.type} value={item.type}>
                      {item.type}
                    </Option>
                  ))}
                </Select>
              </Form>
            </div>
          </Drawer>
        </div>
      </div>
    </>
  );
}

export default Buyer_Reason;
