import { Button, Form, Layout, Select, Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  setFilterBuyer,
  setFilterP0,
  setFilterPromise_date,
  setFilterResultBuyer,
  setFilterResultPO,
  setFilterResultPromise,
  setFilterResultVendor,
  setFilterVendor,
  setSupplieryList,
} from "../actions/supplier_deliverySlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "antd/es/form/Form";

const { Header } = Layout;
const { Option } = Select;
const Supplier_delivery = () => {
  const [form] = useForm();
  const suppliery_list = useSelector((state) => state.supplier_delivery);
  const dispatch = useDispatch();
  async function fetchSupplierAPI() {
    try {
      const response = await axios.get(
        "http://localhost:8123/supplier_delivery"
      );
      if (response.status === 200) {
        dispatch(setSupplieryList(response.data));
        let promise_date_data = [];
        let buyer_data = [];
        let vendor_data = [];
        let po_number = [];
        response.data.forEach((data) => {
          promise_date_data.push(data["Promise Date"]);
          buyer_data.push(data.Buyer);
          vendor_data.push(data["Vendor"]);
          po_number.push(data["PO No"]);
        });
        dispatch(setFilterPromise_date(promise_date_data));
        dispatch(setFilterBuyer(buyer_data));
        dispatch(setFilterVendor(vendor_data));
        dispatch(setFilterP0(po_number));
      } else {
        dispatch(setSupplieryList(...suppliery_list.suppliery_list));
      }
    } catch (error) {
      console.log(error);
    }
  }
  useMemo(() => {
    fetchSupplierAPI();
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
      iten_name: i["Item Name"],
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
  useEffect(() => {
    dispatch(setSupplieryList(suppliery_list_cleansing));
  }, []);
  const removed_duplicated = (item) => {
    const result = [...new Set(item)];
    return result;
  };
  const handlePromiseDateChange = (value) => {
    dispatch(setFilterResultPromise(value));
  };
  const handleBuyerChange = (value) => {
    dispatch(setFilterResultBuyer(value));
  };
  const handleVendorChange = (value) => {
    dispatch(setFilterResultVendor(value));
  };
  const handlePOChange = (value) => {
    dispatch(setFilterResultPO(value));
  };
  const { promise_date, buyer, vendor, purchaseNo } =
    suppliery_list?.temp_state_filter;

  // dataset have filtered
  let suppliery_list_filter_result = suppliery_list_cleansing.filter(
    (item) =>
      item.promise_date === promise_date ||
      String(item.buyer).toLowerCase() === String(buyer).toLowerCase() ||
      String(item.vendor).toLowerCase() === String(vendor).toLowerCase() ||
      parseInt(item.po_no) === parseInt(purchaseNo)
  );
  // list of columns
  const schema = () => {
    const columnsData = [];
    for (const item in suppliery_list_filter_result[0] ||
      suppliery_list_cleansing[0]) {
      let col_data = {
        title: item,
        dataIndex: item,
        key: item,
      };
      columnsData.push(col_data);
    }
    return columnsData;
  };
  const clearFilter = () => {
    form.resetFields();
    handlePromiseDateChange("");
    handleBuyerChange("");
    handleVendorChange("");
    handlePOChange("");
  };
  return (
    <>
      <h1 className="text-2xl font-bold pl-0 p-3">Supplier Delivery</h1>
      <br />
      <div className="grid grid-cols-4 gap-4">
        <Form form={form}>
          <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
            Promise DATE
          </label>
          <Select
            value={suppliery_list.temp_state_filter.promise_date} // Set the value of the Select component
            onChange={handlePromiseDateChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {removed_duplicated(suppliery_list?.filterPromiseDate).map(
              (item) => (
                <Option key={item} value={item}>
                  {item}
                </Option>
              )
            )}
          </Select>
        </Form>
        <Form form={form}>
          <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
            Buyer
          </label>
          <Select
            value={suppliery_list.temp_state_filter.buyer}
            onChange={handleBuyerChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {removed_duplicated(suppliery_list?.filterBuyer).map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Form>
        <Form form={form}>
          <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
            vendor
          </label>
          <Select
            value={suppliery_list.temp_state_filter.vendor} // Set the value of the Select component
            onChange={handleVendorChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {removed_duplicated(suppliery_list?.filterVendor).map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Form>
        <Form form={form}>
          <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
            PO Numbers
          </label>
          <Select
            value={suppliery_list.temp_state_filter.purchaseNo} // Set the value of the Select component
            onChange={handlePOChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {removed_duplicated(suppliery_list?.filterPO).map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Form>
        <Form>
          <Button
            type="button"
            onClick={clearFilter}
            className="w-[160px] bg-white text-[black] font-bold uppercase rounded-2xl border-solid border-2 border-stone-400"
          >
            clear filter
          </Button>
        </Form>
      </div>
      <div className="clear-both mt-10">
        <Table
          className="w-full overflow-y-hidden"
          dataSource={
            suppliery_list_filter_result.length > 0
              ? suppliery_list_filter_result
              : suppliery_list_cleansing
          }
          columns={schema()}
        />
      </div>
    </>
  );
};
export default Supplier_delivery;
