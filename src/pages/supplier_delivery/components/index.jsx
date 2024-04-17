import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Layout,
  Modal,
  Select,
  Table,
  message,
} from "antd";
import { useEffect, useMemo, useState } from "react";
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
} from "../actions/supplier_deliverySlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "antd/es/form/Form";
import moment from "moment";
import convert_to_thai_year_dd_mm_yyyy from "../../../javascript/convert_to_thai_year_dd_mm_yyyy";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { setBuyer_reason } from "../../buyer_reason/actions/buyer_reasonSlice";
import schema from "../../../javascript/print_schema";
const url = "/api/supplier_list";
const { Header } = Layout;
const { Option } = Select;
// class components
const Supplier_delivery = () => {
  // redux/Antd
  const dispatch = useDispatch();
  const [form] = useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // state
  const suppliery_list = useSelector((state) => state.original_delivery_report);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  // date formato f date start & date end
  const dateFormat = "DD/MM/YYYY";

  async function fetchSupplierList() {
    try {
      const response = await axios.get("/api/supplier_list");
      if (response.status === 200) {
        dispatch(setSupplieryList(response.data));
      } else {
        dispatch(setSupplieryList(...suppliery_list.suppliery_list));
      }
    } catch (error) {
      console.log(error);
    }
  }
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
  async function fetchDropdownPoNumber() {
    try {
      const response = await axios.get("/api/dropdown/po_number");
      response.status === 200
        ? dispatch(setFilterP0(response.data))
        : dispatch(setFilterP0(...suppliery_list?.filterPO));
    } catch (error) {
      console.log(error);
    }
  }
  //po_number
  useEffect(() => {
    fetchSupplierList();
    fetchDropdownBuyer();
    fetchDropdownVendor();
    fetchDropdownPoNumber();
  }, []);
  function diff_days(receive_date, promise_date, po_qty, receive_qty) {
    return receive_date - promise_date === 0 && po_qty - receive_qty === 0
      ? 0
      : 1;
  }
  // dataset before filter
  const suppliery_list_cleansing = suppliery_list?.suppliery_list.map((i) => {
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
    dispatch(setSupplieryList(suppliery_list_cleansing));
  }, []);

  // remove every data is duplicate
  const removed_duplicated = (item) => {
    const result = [...new Set(item)];
    return result;
  };
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
    suppliery_list?.temp_state_filter;
  // dataset have filtered
  // let suppliery_list_filter_result = suppliery_list_cleansing.filter((item) => {
  //   const promiseDateMatch =
  //     item.promise_date >=
  //       convert_to_thai_year_dd_mm_yyyy(promise_start_date) &&
  //     item.promise_date < convert_to_thai_year_dd_mm_yyyy(promise_end_date);
  //   const buyerMatch =
  //     String(item.buyer).toLowerCase() === String(buyer).toLowerCase();
  //   const vendorMatch = item.vendor === vendor;
  //   const poNumberMatch = parseInt(item.po_no) === parseInt(purchaseNo);
  //   // Filtering logic
  //   if (
  //     buyer ||
  //     (!buyer &&
  //       !promise_start_date &&
  //       !promise_end_date &&
  //       !vendor &&
  //       !purchaseNo)
  //   ) {
  //     if (buyerMatch) return true;
  //   }
  //   if (!buyer && promise_start_date && promise_end_date) {
  //     if (promiseDateMatch) return true;
  //   }
  //   if (!buyer && vendor) {
  //     if (vendorMatch) return true;
  //   }
  //   if (!buyer && purchaseNo) {
  //     if (poNumberMatch) return true;
  //   }
  //   return false;
  // });
  let suppliery_list_filter_result = suppliery_list_cleansing.filter((item) => {
    // กำหนดตัวแปรสำหรับเก็บผลลัพธ์ของเงื่อนไขทั้งหมด
    let meetsConditions = true;

    // ตรวจสอบเงื่อนไขสำหรับ BUYER (ถ้ามี)
    if (buyer) {
      meetsConditions =
        meetsConditions &&
        String(item.buyer).toLowerCase() === String(buyer).toLowerCase();
    }

    // ตรวจสอบเงื่อนไขสำหรับ VENDOR (ถ้ามี)
    if (vendor) {
      meetsConditions =
        meetsConditions &&
        String(item.vendor).toLowerCase() === String(vendor).toLowerCase();
    }

    // ตรวจสอบเงื่อนไขสำหรับ PROMISE DATE FROM (ถ้ามี)
    if (promise_start_date) {
      meetsConditions =
        meetsConditions &&
        item.promise_date >=
          convert_to_thai_year_dd_mm_yyyy(promise_start_date);
    }

    // ตรวจสอบเงื่อนไขสำหรับ PROMISE DATE TO (ถ้ามี)
    if (promise_end_date) {
      meetsConditions =
        meetsConditions &&
        item.promise_date < convert_to_thai_year_dd_mm_yyyy(promise_end_date);
    }

    // ตรวจสอบเงื่อนไขสำหรับ PO NUMBERS (ถ้ามี)
    if (purchaseNo) {
      meetsConditions =
        meetsConditions && parseInt(item.po_no) === parseInt(purchaseNo);
    }

    // ส่งผลลัพธ์กลับเมื่อเงื่อนไขทั้งหมดถูกต้อง
    return meetsConditions;
  });

  // actions of Clear filter
  const clearFilter = () => {
    form.resetFields();
    dispatch(setFilterResultPromiseStart(""));
    dispatch(setFilterResultPromiseEnd(""));
    handleBuyerChange("");
    handleVendorChange("");
    handlePOChange("");
  };
  // const handleCheckboxChange = (element) => {
  //   console.log(element);
  // };
  // // checbox UI
  // const checkAll = (e) => {
  //   let status = e.target.checked;
  //   let selectBox = [];
  //   // check
  //   if (status === true) {
  //     selectBox.push(
  //       suppliery_list_filter_result.length > 0
  //         ? suppliery_list_filter_result
  //         : suppliery_list_cleansing
  //     );
  //     setChecked(status);
  //     console.log(selectBox[0]);
  //   }
  //   // uncheck
  //   else {
  //     selectBox.push(...selectBox);
  //     console.log(selectBox);
  //     setChecked(status);
  //   }
  // };
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
        //dispatch(setBuyer_reason(suppliery_list_filter_result));
        const response = await axios.post(
          "/api/load_data_buyer_reason",
          suppliery_list_filter_result
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
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold pl-0 p-3 float-left">
          Supplier Delivery
        </h1>
        <div className="flex flex-row float-right">
          <Button
            type="button"
            onClick={clearFilter}
            className="float-left mt-2 mr-5 bg-[white] text-[black] font-bold uppercase rounded-2xl border-solid border-2 border-[black]"
          >
            clear filter
          </Button>
          <Button
            disabled={
              promise_start_date != "" &&
              promise_end_date != "" &&
              buyer != "" &&
              vendor != "" &&
              purchaseNo != ""
                ? false
                : true
            }
            onClick={() => setIsModalOpen(true)}
            className="float-left mt-2 bg-[#006254] text-[white] font-bold uppercase rounded-2xl border-solid border-2 border-[#006254]"
          >
            Confirm
          </Button>
        </div>
        <Modal open={isModalOpen} footer={null} closeIcon={null}>
          <div role="alert">
            {/* <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
              หมายเหตุ
            </div>
            <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
              <p className="text-wrap text-lg">
                ยืนยันโอนย้ายรายการทั้งหมดของ {buyer} ไปยัง Buyer Reason
                เมื่อยืนยันแล้วจะไม่สามารถทำรายการของเดือน ช่วงระหว่าง{" "}
                {promise_start_date} - {promise_end_date}{" "}
                ที่หน้านี้ได้อีกทุกกรณี
              </p>
            </div> */}
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
      <Form form={form} className="grid grid-cols-5 gap-5 clear-both">
        <Form.Item>
          <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
            Buyer
          </label>
          <Select
            allowClear={true}
            value={suppliery_list.temp_state_filter.buyer}
            onChange={handleBuyerChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {suppliery_list?.filterBuyer.map((item) => (
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
          <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
            vendor
          </label>
          <Select
            allowClear={true}
            value={suppliery_list.temp_state_filter.vendor} // Set the value of the Select component
            onChange={handleVendorChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {suppliery_list?.filterVendor.map((item) => (
              <Option key={item.Vendor} value={item.Vendor}>
                {item.Vendor}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
            PO Numbers
          </label>
          <Select
            allowClear={true}
            value={suppliery_list.temp_state_filter.purchaseNo} // Set the value of the Select component
            onChange={handlePOChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {suppliery_list?.filterPO.map((item) => (
              <Option key={item.po_no} value={item.po_no}>
                {item.po_no}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      <div className="clear-both mt-10">
        {/* <Table
          className="w-full overflow-y-hidden"
          dataSource={
            suppliery_list_filter_result.length > 0
              ? suppliery_list_filter_result
              : suppliery_list_cleansing
          }
          columns={[
            {
              title: <Checkbox onChange={checkAll}></Checkbox>,
              key: "action",
              render: (text, value) => (
                <Checkbox
                  indeterminate={checked}
                  onChange={handleCheckboxChange.bind(this, value)}
                />
              ),
            },
          ].concat(schema())}
        /> */}
        <Table
          className="w-full overflow-y-hidden"
          dataSource={suppliery_list_filter_result}
          columns={schema(suppliery_list_filter_result)}
        />
      </div>
    </>
  );
};
export default Supplier_delivery;
