import { Button, Form, Modal, Select, Table, message } from "antd";
import { useMemo, useState } from "react";
import {
  setFilterBuyer,
  setFilterP0,
  setFilterResultBuyer,
  setFilterResultPO,
  setFilterResultVendor,
  setFilterVendor,
  setSupplieryList,
  setFilterResultPromiseStart,
  setFilterResultPromiseEnd,
} from "../actions/original_deliverySlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "antd/es/form/Form";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { setBuyer_reason } from "../../buyer_reason/actions/buyer_reasonSlice";
import schema from "../../../javascript/print_schema";
const { Option } = Select;
// class components
const Original_delivery = () => {
  // redux/Antd
  const dispatch = useDispatch();
  const [form] = useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [
    original_delivery_report_filter_result,
    setOriginal_delivery_report_filter_result,
  ] = useState([]);
  // state
  const original_delivery_report = useSelector(
    (state) => state.original_delivery_report
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirm, setConfirm] = useState(true);
  // date formato f date start & date end
  const dateFormat = "DD/MM/YYYY";

  async function fetchSupplierList() {
    try {
      const response = await axios.get("/api/original_delivery_report");
      if (response.status === 200) {
        dispatch(setSupplieryList(response.data));
      } else {
        dispatch(
          setSupplieryList(...original_delivery_report.original_delivery_report)
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchDropdownBuyer() {
    try {
      const response = await axios.get("/api/original_delivery_report/dropdown/buyer");
      response.status === 200
        ? dispatch(setFilterBuyer(response.data))
        : dispatch(setFilterBuyer(...original_delivery_report?.filterBuyer));
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchDropdownVendor() {
    try {
      const response = await axios.get("/api/original_delivery_report/dropdown/vendor");
      response.status === 200
        ? dispatch(setFilterVendor(response.data))
        : dispatch(setFilterVendor(...original_delivery_report?.filterVendor));
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchDropdownPoNumber() {
    try {
      const response = await axios.get("/api/original_delivery_report/dropdown/po_number");
      response.status === 200
        ? dispatch(setFilterP0(response.data))
        : dispatch(setFilterP0(...original_delivery_report?.filterPO));
    } catch (error) {
      console.log(error);
    }
  }
  function diff_days(receive_date, promise_date, po_qty, receive_qty) {
    return receive_date - promise_date === 0 && po_qty - receive_qty === 0
      ? 0
      : 1;
  }
  // dataset is cleansing after filter
  const original_delivery_report_cleansing =
    original_delivery_report_filter_result.map((i) => {
      const diff_day = diff_days(
        i["Receive Date"],
        i["Promise Date"],
        i["PO QTY"],
        i["Received QTY"]
      );
      return {
        item_no: i["Item No"],
        item_name: i["Item Name"],
        uom: i.UOM,
        transaction: i.Transaction,
        buyer: i.Buyer,
        po_no: i["PO No"],
        po_release: i["PO release"],
        vendor: i["Vendor"],
        po_qty: parseInt(i["PO QTY"]),
        received_qty: parseInt(i["Received QTY"]),
        need_by_date: i["Need By Date"],
        promise_date: i["Promise Date"],
        received_date: i["Receive Date"],
        diff_day: diff_day,
        days_more: diff_day < -3 ? 1 : "",
        before_3_days: diff_day === -3 ? 1 : "",
        before_2_days: diff_day === -2 ? 1 : "",
        before_1_days: diff_day === -1 ? 1 : "",
        on_time: diff_day === 0 ? 1 : "",
        delay_1_day: diff_day === 1 ? 1 : "",
        delay_2_days: diff_day === 2 ? 1 : "",
        delay_3_days: diff_day === 3 ? 1 : "",
        delay_3_days_more: diff_day > 3 ? 1 : "",
        status:
          diff_day == 0
            ? "On Time"
            : diff_day == 1
            ? "Delay 1 Day"
            : diff_day == 2
            ? "Delay 2 Day"
            : diff_day == 3
            ? "Delay 3 Day"
            : diff_day > 3
            ? "Delay 3 Days More"
            : diff_day < -3
            ? "Before 3 Days More"
            : diff_day === -3
            ? "Before 3 Days"
            : diff_day === -2
            ? "Before 2 Days"
            : diff_day === -1
            ? "Before 1 Day"
            : "",
        t_id: i["T_ID"],
      };
    });
  useMemo(() => {
    fetchSupplierList();
    fetchDropdownBuyer();
    fetchDropdownVendor();
    fetchDropdownPoNumber();
    dispatch(setSupplieryList(original_delivery_report_cleansing));
  }, []);
  //actions of Promise date Start
  const handlePromiseStartDate = (a, dateString) => {
    dispatch(setFilterResultPromiseStart(dateString));
  };
  //actions of Promise date to
  const handlePromisetoDate = (a, dateString) => {
    dispatch(setFilterResultPromiseEnd(dateString));
  };
  //actions of buyer dropdown
  const handleBuyerChange = (value) => {
    dispatch(setFilterResultBuyer(value));
  };
  //actions of vendor dropdown
  const handleVendorChange = (value) => {
    dispatch(setFilterResultVendor(value));
  };
  //actions of purchase order dropdown
  const handlePOChange = (value) => {
    dispatch(setFilterResultPO(value));
  };
  const { promise_start_date, promise_end_date, buyer, vendor, purchaseNo } =
    original_delivery_report?.temp_state_filter;
  // actions of Clear filter
  const clearFilter = () => {
    form.resetFields();
    dispatch(setSupplieryList([]));
    setOriginal_delivery_report_filter_result([]);
    dispatch(setFilterResultPromiseStart(""));
    dispatch(setFilterResultPromiseEnd(""));
    handleBuyerChange("");
    handleVendorChange("");
    handlePOChange("");
    setConfirm(true);
  };
  const load_toBuyer_reason = () => {
    const action_inSec = 5000;
    try {
      messageApi.open({
        type: "success",
        content: `This is a success for loading to Buyer Reason page, and thses message will close in ${
          action_inSec / 1000
        } seconds`,
        duration: action_inSec / 1000,
      });
      setTimeout(async () => {
        const response = await axios.post(
          "/api/load_data_buyer_reason",
          original_delivery_report_cleansing
        );
        if (response.status === 200) {
          clearFilter();
          setIsModalOpen(false);
        } else {
          setIsModalOpen(true);
        }
      }, action_inSec);
    } catch (error) {
      if (error) {
        messageApi.open({
          type: "error",
          content: "This is an error message",
        });
        setTimeout(() => {
          dispatch(setBuyer_reason([]));
        }, action_inSec);
      }
    }
  };
  const manageFilter = async (val) => {
    let queryString = "";
    if (buyer != "") {
      queryString += `[Buyer] = ${JSON.stringify(buyer).replace(/"/g, "'")}`;
      setConfirm(false);
    }
    if (vendor != "") {
      queryString += ` AND [Vendor] = ${JSON.stringify(vendor).replace(
        /"/g,
        "'"
      )}`;
      setConfirm(false);
    }
    if (purchaseNo != "") {
      queryString += ` AND [PO No] = ${purchaseNo}`;
    }
    const response = await axios.post("/api/original_delivery_report/supplier_list_filter_optional", {
      queryString,
    });
    if (response.status === 200) {
      setOriginal_delivery_report_filter_result(response.data);
      setConfirm(false);
    } else {
      setConfirm(true);
    }
  };
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold pl-0 p-3 mb-10 float-left">
          Original Delivery Report
        </h1>
        {/* <div className="flex flex-row float-right">
          <Button
            disabled={confirm}
            onClick={() => setIsModalOpen(true)}
            className="float-left mt-2 bg-[#006254] text-[white] font-bold uppercase rounded-2xl border-solid border-2 border-[#006254]"
          >
            Confirm
          </Button>
        </div> */}
        <Modal open={isModalOpen} footer={null} closeIcon={null}>
          <div role="alert">
            <ExclamationCircleOutlined className="text-8xl text-[red] table m-auto mb-5" />
            <h1 className="text-lg font-bold text-center text-[red]">
              หมายเหตุ
            </h1>
            <p className="text-center">
              การโอนย้ายรายการทั้งหมดของ {buyer} ไปยังหน้า Buyer Reason
              เมื่อยืนยันแล้วจะไม่สามารถทำรายการ ที่หน้านี้ได้อีกทุกกรณี
            </p>
            <br />
            <div className="table flex-row m-auto">
              {contextHolder}
              <Button
                type="button"
                onClick={load_toBuyer_reason}
                className="bg-[#006254] text-[white] font-bold uppercase rounded-2xl border-solid border-2 border-[#006254] mr-5"
              >
                YES
              </Button>{" "}
              <Button
                type="button"
                className="bg-[white] text-[black] font-bold uppercase rounded-2xl border-solid border-2 border-[black]"
                onClick={() => setIsModalOpen(false)}
              >
                NO
              </Button>
            </div>
            <br />
          </div>
        </Modal>
      </div>
      <Form
        onFinish={manageFilter}
        form={form}
        className="grid grid-cols-3 gap-3 clear-both"
      >
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
            value={original_delivery_report.temp_state_filter.buyer}
            onChange={handleBuyerChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {original_delivery_report?.filterBuyer.map((item) => (
              <Option key={item.Buyer} value={item.Buyer}>
                {item.Buyer}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="VENDOR" name={"VENDOR"}>
          <Select
            value={original_delivery_report.temp_state_filter.vendor} // Set the value of the Select component
            onChange={handleVendorChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {original_delivery_report?.filterVendor.map((item) => (
              <Option key={item.Vendor} value={item.Vendor}>
                {item.Vendor}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="PO Numbers" name={"PO Numbers"}>
          <Select
            value={original_delivery_report.temp_state_filter.purchaseNo} // Set the value of the Select component
            onChange={handlePOChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {original_delivery_report?.filterPO.map((item) => (
              <Option key={item.po_no} value={item.po_no}>
                {item.po_no}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <div className="flex flex-row">
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
          dataSource={original_delivery_report_filter_result}
          columns={schema(original_delivery_report_filter_result)}
        />
      </div>
    </>
  );
};
export default Original_delivery;
