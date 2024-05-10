import { Button, Form, Table, message } from "antd";
import { useMemo, useState } from "react";
import { setConfirmBtnStatus } from "../../../components/confirm_supplier/actions/confirm_modalSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "antd/es/form/Form";
import schema from "../../../javascript/print_schema";
import Confirm_btn from "../../../components/confirm_supplier/components/confirm_btn";
import Confirm_Modal from "./confirm_modal";
import Buyer_filter from "../../../components/filter_form/buyer_filter";
import Promise_date_from from "../../../components/filter_form/promise_date_from";
import Promise_date_to from "../../../components/filter_form/promise_date_to";
import Vendor_filter from "../../../components/filter_form/vendor_filter";
import PurchaseOrder_filter from "../../../components/filter_form/purchaseOrder_filter";
import {
  resetAllState,
  setSupplieryList,
} from "../../../components/filter_form/actions/filterSlice";
import Export from "../../../components/export_data";

// class components
const Supplier_delivery = (props) => {
  // redux/Antd
  const dispatch = useDispatch();
  const [form] = useForm();
  // state
  const filter = useSelector((state) => state.filter);
  const confirmBtnStatus = useSelector(
    (state) => state.confirm_supplier.confirmBtnStatus
  );
  const [suppliery_list_filter_result, setSuppliery_list_filter_result] =
    useState([]);
  // date formato f date start & date end
  const dateFormat = "DD/MM/YYYY";

  async function fetchSupplierList() {
    try {
      const response = await axios.get(`${props.baseUrl}/api/supplier_list`);
      if (response.status === 200) {
        dispatch(setSupplieryList(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  }

  useMemo(() => {
    fetchSupplierList();
  }, []);
  const { promise_start_date, promise_end_date, buyer, vendor, purchaseNo } =
    filter?.temp_state_filter;
  let queryString = "";
  const manageFilter = async (val) => {
    try {
      if (buyer != "") {
        queryString += `[Buyer] = ${JSON.stringify(buyer).replace(/"/g, "'")}`;
        dispatch(setConfirmBtnStatus(false));
      }
      if (promise_start_date != "" && promise_end_date != "") {
        queryString += ` AND [Promise Date] BETWEEN ${JSON.stringify(
          promise_start_date
        ).replace(/"/g, "'")} AND ${JSON.stringify(promise_end_date).replace(
          /"/g,
          "'"
        )}`;
        dispatch(setConfirmBtnStatus(false));
      }
      if (vendor != "") {
        queryString += ` AND [Vendor] = ${JSON.stringify(vendor).replace(
          /"/g,
          "'"
        )}`;
        dispatch(setConfirmBtnStatus(false));
      }
      if (purchaseNo != "") {
        queryString += ` AND [PO No] = ${purchaseNo}`;
        dispatch(setConfirmBtnStatus(false));
      }
      const response = await axios.post(
        `${props.baseUrl}/api/supplier_list_filter_optional`,
        {
          queryString,
        }
      );
      if (response.status === 200) {
        setSuppliery_list_filter_result(response.data);
        dispatch(resetAllState());
        dispatch(setConfirmBtnStatus(false));
      } else {
        setSuppliery_list_filter_result(...suppliery_list_filter_result);
        dispatch(setConfirmBtnStatus(true));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // actions of Clear filter
  const clearFilter = () => {
    form.resetFields();
    setSuppliery_list_filter_result([]);
    dispatch(resetAllState());
    dispatch(setConfirmBtnStatus(true));
  };
  return (
    <>
      <div>
        <div className="float-left">
          <h1 className="text-2xl font-bold pl-0 p-3">
            Supplier Delivery Report
          </h1>
          <p className="text-left">
            Data would be represent the value is{" "}
            <strong className="underline uppercase">diff</strong> only
          </p>
          <br />
        </div>
        <div className="flex flex-row float-right">
          <Confirm_btn confirmBtnStatus={confirmBtnStatus} />
        </div>
        <Confirm_Modal
          baseUrl={props.baseUrl}
          payload={suppliery_list_filter_result}
        />
      </div>
      <Form onFinish={manageFilter} form={form}>
        <div className="grid grid-cols-3 gap-3 clear-both">
          <Buyer_filter baseUrl={props.baseUrl} />
          <Promise_date_from
            dateFormat={dateFormat}
            promise_start_date={promise_start_date}
          />
          <Promise_date_to
            dateFormat={dateFormat}
            promise_start_date={promise_start_date}
          />
          <Vendor_filter baseUrl={props.baseUrl} />
          <PurchaseOrder_filter baseUrl={props.baseUrl} />
        </div>
        <Form.Item className="grid grid-cols-3 gap-3">
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
            <Export
              baseUrl={props.baseUrl}
              dataset={suppliery_list_filter_result}
            />
          </div>
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
