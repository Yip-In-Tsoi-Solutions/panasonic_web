import React, { memo, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Select, Table, Drawer, Input, Tooltip } from "antd";
import axios from "axios";
import { useForm } from "antd/es/form/Form";
import {
  setDropdownBuyer,
  setBuyer_reason,
  setDropdownRootCause,
  setFilterRootCause,
  setDropdownAction,
  setFilterAction,
  setProduction_Shipment,
  resetRootCause,
  resetAction,
  resetProduction_Ship,
} from "../actions/buyer_reasonSlice";
import schema from "../../../javascript/print_schema";
import TextArea from "antd/es/input/TextArea";
import Buyer_filter from "../../../components/filter_form/buyer_filter";
import Promise_date_to from "../../../components/filter_form/promise_date_to";
import Promise_date_from from "../../../components/filter_form/promise_date_from";
import { resetAllState } from "../../../components/filter_form/actions/filterSlice";
import Export from "../../../components/export_data";
import Buyer_reason_pdf from "../../../components/generate_pdf/buyer_reason_pdf/components";
import convertDateFormat from "../../../javascript/convertDateFormat";
function Buyer_Reason(props) {
  const [form] = useForm();
  // State of Components
  const dateFormat = "DD/MM/YYYY";
  // open update form
  const [openUpdateForm, setUpdateForm] = useState(false);
  const [reason, setReason] = useState("");
  // state
  const buyer_reason = useSelector((state) => state.buyer_reason_report);
  const filter = useSelector((state) => state.filter);
  const [current_selected, setCurrentSelected] = useState({
    promiseDate: "",
    receive_date: "",
    vendor: "",
    buyer: "",
    item_no: "",
    po_number: 0,
    po_release: 0,
    transaction_id: "",
    ms_excel: "",
    csv: "",
    payload: "",
  });
  const [updateBtn_status, setBtnStatus] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const dispatch = useDispatch();
  // fetch api data of Dropdown buyer
  async function fetchDropdownBuyer() {
    try {
      const response = await axios.get(`${props.baseUrl}/api/dropdown/buyer`, {
        headers: {
          Authorization: `Bearer ${props.token_id}`,
        },
      });
      response.status === 200
        ? dispatch(setDropdownBuyer(response.data))
        : dispatch(setDropdownBuyer(...buyer_reason?.dropdown_buyerlist));
    } catch (error) {
      if (error) {
        window.location.href = "/error_login";
      }
    }
  }
  // fetch api data of Dropdown Root-cause
  async function fetchDropdownRootCause() {
    try {
      const response = await axios.get(
        `${props.baseUrl}/api/dropdown/root_cause`,
        {
          headers: {
            Authorization: `Bearer ${props.token_id}`,
          },
        }
      );
      response.status === 200
        ? dispatch(setDropdownRootCause(response.data))
        : dispatch(setDropdownRootCause(...buyer_reason?.dropdown_rootCause));
    } catch (error) {
      if (error) {
        window.location.href = "/error_login";
      }
    }
  }
  // fetch api data of Dropdown Action
  async function fetchDropdownAction() {
    try {
      const response = await axios.get(
        `${props.baseUrl}/api/dropdown/actions`,
        {
          headers: {
            Authorization: `Bearer ${props.token_id}`,
          },
        }
      );
      response.status === 200
        ? dispatch(setDropdownAction(response.data))
        : dispatch(setDropdownAction(...buyer_reason?.dropdown_action));
    } catch (error) {
      if (error) {
        window.location.href = "/error_login";
      }
    }
  }
  // API render
  useMemo(() => {
    fetchDropdownBuyer();
    fetchDropdownRootCause();
    fetchDropdownAction();
  }, []);
  // Action of Components
  const { promise_start_date, promise_end_date, buyer } =
    filter?.temp_state_filter;

  const handleRootCauseChange = (value) => {
    dispatch(setFilterRootCause(value));
  };
  const handleActionChange = (value) => {
    dispatch(setFilterAction(value));
  };
  const handleProduction_Shipment = (value) => {
    dispatch(setProduction_Shipment(value));
  };
  // action of Buyer select & Optional select
  const manageFilter = async () => {
    try {
      let queryString = "";
      if (buyer != "") {
        queryString += `[Buyer] = ${JSON.stringify(buyer).replace(/"/g, "'")}`;
      }
      if (promise_start_date != "" && promise_end_date != "") {
        queryString += ` AND convert(nvarchar(10), [PROMISED_DATE], 120) BETWEEN ${JSON.stringify(
          convertDateFormat(promise_start_date)
        ).replace(/"/g, "'")} AND ${JSON.stringify(
          convertDateFormat(promise_end_date)
        ).replace(/"/g, "'")}`;
      }
      dispatch(resetAllState());
      sessionStorage.setItem("buyer_between_date", queryString);
      const response = await axios.post(
        `${props.baseUrl}/api/buyerlist_filter_optional`,
        {
          queryString,
        },
        {
          headers: {
            Authorization: `Bearer ${props.token_id}`,
          },
        }
      );
      if (response.status === 200) {
        form.resetFields();
        dispatch(resetAllState());
        dispatch(setBuyer_reason(response.data));
      } else {
        dispatch(setBuyer_reason(...buyer_reason?.buyer_reason_table));
      }
    } catch (error) {
      if (error) {
        window.location.href = "/error_not_found";
      }
    }
  };
  //actions of Clear State
  const clearFilter = () => {
    form.resetFields();
    dispatch(setBuyer_reason([]));
    dispatch(resetAllState());
  };
  // action of Update reason
  const updateReasonDetail = (item) => {
    setUpdateForm(true);
    const {
      PROMISED_DATE,
      BUYER,
      SUPPLIER,
      ITEM_NO,
      PO_NUMBER,
      PO_RELEASE,
      TRANSACTION_ID,
      receive_date,
      DELAY_CAUSE,
    } = item;
    setCurrentSelected({
      promiseDate: PROMISED_DATE,
      receive_date: receive_date,
      buyer: BUYER,
      vendor: SUPPLIER,
      item_no: ITEM_NO,
      po_number: PO_NUMBER,
      po_release: PO_RELEASE,
      payload: item,
      transaction_id: TRANSACTION_ID,
    });
  };
  // insert to PECTH_SUPPLIER_DELIVERY_KPI

  const updateReason = async () => {
    try {
      let payload = {
        promise_date: current_selected.promiseDate,
        receive_date: current_selected.receive_date,
        reason: reason,
        root_cause: buyer_reason?.temp_state_filter?.rootCause,
        delay_cause: buyer_reason?.temp_state_filter?.rootCause[0],
        action: buyer_reason?.temp_state_filter?.action,
        effect_production_shipment:
          buyer_reason?.temp_state_filter?.production_Shipment,
        item_no: current_selected?.item_no,
      };
      const transaction_id = current_selected?.transaction_id;
      const response = await axios.put(
        `${props.baseUrl}/api/buyer/update_reason/${transaction_id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${props.token_id}`,
          },
        }
      );
      if (response.status === 200) {
        const reply = await axios.post(
          `${props.baseUrl}/api/buyerlist/latest_data`,
          { buyer_between_date: sessionStorage.getItem("buyer_between_date") },
          {
            headers: {
              Authorization: `Bearer ${props.token_id}`,
            },
          }
        );
        if (reply.status === 200) {
          form.resetFields();
          dispatch(setBuyer_reason(reply.data));
          setCurrentSelected("");
          dispatch(resetRootCause());
          dispatch(resetAction());
          dispatch(resetProduction_Ship());
          setReason("");
          dispatch(resetAllState());
          setUpdateForm(false);
        }
      }
    } catch (error) {
      if (error) {
        window.location.href = "/error_login";
      }
    }
  };
  const export_url = props.baseUrl;
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold pl-0 p-3 mb-5 uppercase">
          Buyer reason
        </h1>
        <Form
          onFinish={manageFilter}
          form={form}
          className="grid grid-cols-3 gap-3 gap-y-0 clear-both"
        >
          <Buyer_filter
            pageTitle={props.page_title}
            token_id={props.token_id}
            baseUrl={props.baseUrl}
          />
          <Promise_date_from
            dateFormat={dateFormat}
            promise_start_date={promise_start_date}
          />
          <Promise_date_to
            dateFormat={dateFormat}
            promise_start_date={promise_start_date}
          />
          <Form.Item>
            <div className="flex flex-row">
              <Button htmlType="submit" className="uppercase">
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
              <Button onClick={clearFilter} className="uppercase ml-5 mr-5">
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
              <Export
                baseUrl={props.baseUrl}
                export_fileName={"Buyer_Reason"}
                dataset={buyer_reason?.buyer_reason_table}
              />
              <Buyer_reason_pdf
                baseUrl={props.baseUrl}
                token_id={props.token_id}
                page_title={props.page_title}
                buyer_data={buyer_reason?.buyer_reason_table}
                filterData={sessionStorage.getItem("buyer_between_date")}
              />
            </div>
          </Form.Item>
        </Form>
        <div className="clear-both">
          <Table
            className="w-full overflow-y-hidden"
            dataSource={
              buyer_reason?.buyer_reason_table.length > 0
                ? buyer_reason?.buyer_reason_table
                : ""
            }
            columns={
              buyer_reason?.buyer_reason_table.length > 0
                ? [
                    {
                      title: "Action".toUpperCase(),
                      key: "action",
                      render: (record) => (
                        <Tooltip
                          placement="top"
                          title={
                            record?.CONFIRM_REASON_DATE != "" &&
                            record?.REASON_REMARK != ""
                              ? "This buyer has been updated for the reason".toUpperCase()
                              : "Update Reason".toUpperCase()
                          }
                        >
                          <Button
                            disabled={
                              record?.CONFIRM_REASON_DATE != null ? true : false
                            }
                            onClick={() => updateReasonDetail(record)}
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
                            </div>
                          </Button>
                        </Tooltip>
                      ),
                    },
                  ].concat(schema(buyer_reason?.buyer_reason_table))
                : schema(buyer_reason?.buyer_reason_table)
            }
            scroll={{ x: "max-content" }}
            pagination={{
              showSizeChanger: true,
              pageSize: pageSize, // Set the initial page size
              defaultPageSize: 5,
              pageSizeOptions: ["5", "10", "20", "50", "100", "200"],
              onShowSizeChange: (current, size) => setPageSize(size), // Function to handle page size changes
              position: ["bottomCenter"],
            }}
          />
          <Drawer
            title="REASON UPDATE"
            onClose={() => setUpdateForm(false)}
            open={openUpdateForm}
            width={window.innerWidth / 1.5}
          >
            <h1 className="italic uppercase">Current data</h1>
            <Form className="grid grid-cols-3 gap-3 clear-both">
              <Form.Item>
                <label className="block mb-2 text-sm text-gray-900 uppercase font-bold">
                  promise date
                </label>
                <Input disabled={true} value={current_selected?.promiseDate} />
              </Form.Item>
              <Form.Item>
                <label className="block mb-2 text-sm text-gray-900 uppercase font-bold">
                  vendor
                </label>
                <Input disabled={true} value={current_selected?.vendor} />
              </Form.Item>
              <Form.Item>
                <label className="block mb-2 text-sm text-gray-900 uppercase font-bold">
                  ITEM_NO
                </label>
                <Input disabled={true} value={current_selected?.item_no} />
              </Form.Item>
            </Form>
            <Form className="grid grid-cols-3 gap-3 clear-both">
              <Form.Item>
                <label className="block mb-2 text-sm text-gray-900 uppercase font-bold">
                  BUYER
                </label>
                <Input disabled={true} value={current_selected?.buyer} />
              </Form.Item>
              <Form.Item>
                <label className="block mb-2 text-sm text-gray-900 uppercase font-bold">
                  PO_NUMBER
                </label>
                <Input disabled={true} value={current_selected?.po_number} />
              </Form.Item>
              <Form.Item>
                <label className="block mb-2 text-sm text-gray-900 uppercase font-bold">
                  PO RELEASE
                </label>
                <Input disabled={true} value={current_selected?.po_release} />
              </Form.Item>
            </Form>
            <br />
            <h1 className="italic uppercase">update Information</h1>
            <br />
            <Form form={form} className="grid grid-cols-2 gap-2 clear-both">
              <Form.Item
                label={"root-cause".toUpperCase()}
                name={"root-cause".toUpperCase()}
              >
                <Select
                  value={buyer_reason?.temp_state_filter?.rootCause}
                  onChange={handleRootCauseChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  {buyer_reason?.dropdown_rootCause.map((item) => (
                    <Option key={item.ROOT_CAUSE} value={item.ROOT_CAUSE}>
                      {item.ROOT_CAUSE}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={"Action".toUpperCase()}
                name={"Action".toUpperCase()}
              >
                <Select
                  value={buyer_reason?.temp_state_filter?.action}
                  onChange={handleActionChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  {buyer_reason?.dropdown_action.map((item) => (
                    <Option key={item.ACTION} value={item.ACTION}>
                      {item.ACTION}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Effect_Production_Shipment"
                name={"Effect_Production_Shipment"}
              >
                <Select
                  value={buyer_reason?.temp_state_filter?.production_Shipment}
                  onChange={handleProduction_Shipment}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  {["Yes", "No"].map((item) => (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
            <Form>
              <Form.Item>
                <label className="uppercase font-bold">
                  write reason (Optional){"   "}
                  <span className="font-normal text-[red] text-[12px] italic">
                    No more than 250 characters
                  </span>
                </label>
                <TextArea
                  placeholder="write buyer reason here"
                  value={reason}
                  autoSize={{
                    minRows: 6,
                    maxRows: 12,
                  }}
                  onChange={(e) => setReason(e.target.value)}
                />
                <Button
                  disabled={
                    buyer_reason?.temp_state_filter?.rootCause != "" &&
                    buyer_reason?.temp_state_filter?.action != "" &&
                    buyer_reason?.temp_state_filter?.production_Shipment != ""
                      ? false
                      : true
                  }
                  type="primary"
                  style={{
                    backgroundColor:
                      buyer_reason?.temp_state_filter?.rootCause != "" &&
                      buyer_reason?.temp_state_filter?.action != "" &&
                      buyer_reason?.temp_state_filter?.production_Shipment != ""
                        ? "#006254"
                        : "#eee",
                  }}
                  onClick={updateReason}
                  className="mt-5 text-[white] font-bold uppercase rounded-2xl border-solid border-2 border-[#006254]"
                >
                  UPDATE
                </Button>
              </Form.Item>
            </Form>
          </Drawer>
        </div>
      </div>
    </>
  );
}
export default memo(Buyer_Reason);
