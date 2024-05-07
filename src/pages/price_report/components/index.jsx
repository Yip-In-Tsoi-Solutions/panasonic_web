import { Button, Drawer, Form, Input, Table, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "antd/es/form/Form";
import Promise_date_from from "../../../components/filter_form/date_with_require/promise_date_from";
import Promise_date_to from "../../../components/filter_form/date_with_require/promise_date_to";
import {
  resetBuyerFilter,
  resetPromiseEndDateFilter,
  resetPromiseStartDateFilter,
} from "../../../components/filter_form/actions/filterSlice";
import { setSupplieryList } from "../actions/priceReportSlice";
import schema from "../../../javascript/print_schema";
import axios from "axios";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
const PriceReport = () => {
  const [form] = useForm();
  const [openUpdateForm, setUpdateForm] = useState(false);
  const [current_selected, setCurrentSelected] = useState({
    invoice_date: "",
    item_no: "",
    invoice_num: "",
    po_number: 0,
    po_release: 0,
    vendor: "",
    invoice_unit_price: 0,
    amount: 0,
    currency: "",
  });
  const [remark, setRemark] = useState("");
  const priceReport = useSelector(
    (state) => state?.priceReport?.suppliery_list
  );
  const filter = useSelector((state) => state?.filter?.temp_state_filter);
  const dispatch = useDispatch();
  const dateFormat = "DD/MM/YYYY";
  const { promise_start_date, promise_end_date } = filter;
  //Action of Filter
  const manageFilter = async () => {
    try {
      let queryString = "";
      if (promise_start_date != "" && promise_end_date != "") {
        queryString += `INVOICE_DATE BETWEEN ${JSON.stringify(
          promise_start_date
        ).replace(/"/g, "'")} AND ${JSON.stringify(promise_end_date).replace(
          /"/g,
          "'"
        )}`;
      }
      const response = await axios.post("/api/price_report/data", {
        queryString,
      });
      if (response.status === 200) {
        dispatch(setSupplieryList(response.data));
      }
    } catch (error) {
      console.log(error)
    }
  };
  const clearFilter = async () => {
    form.resetFields();
    dispatch(setSupplieryList([]));
    dispatch(resetPromiseStartDateFilter());
    dispatch(resetPromiseEndDateFilter());
  };
  const selectRemarkForm = (item) => {
    setCurrentSelected({
      invoice_date: item?.INVOICE_DATE,
      item_no: item?.ITEM,
      invoice_num: item?.INVOICE_NUM,
      po_number: item?.PO_NUMBER,
      po_release: item?.PO_RELEASE,
      vendor: item?.VENDOR_NAME,
      invoice_unit_price: item?.INVOICE_UNIT_PRICE,
      amount: item?.AMOUNT,
      currency: item?.INV_CURRENCY,
    });
    setUpdateForm(true);
  };
  const submitRemark = () => {
    form.resetFields();
    // console.log(remark)
    setRemark("");
  };
  return (
    <div>
      <h1 className="text-2xl font-bold pl-0 p-3 mb-5">Price Report</h1>
      <Form
        onFinish={manageFilter}
        form={form}
        className="grid grid-cols-3 gap-3 clear-both"
      >
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
      <br />
      <Table
        className="overflow-y-hidden"
        dataSource={priceReport}
        columns={[
          {
            title: "Action".toUpperCase(),
            key: "action",
            render: (record) => (
              <Tooltip placement="top" title={"Update Remark".toUpperCase()}>
                <Button
                  onClick={selectRemarkForm.bind(this, record)}
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
        ].concat(schema(priceReport))}
      />
      <Drawer
        title="Update Remark"
        onClose={() => setUpdateForm(false)}
        open={openUpdateForm}
        width={window.innerWidth / 1.5}
      >
        <h1 className="italic uppercase">Current data</h1>
        <Form
          form={form}
          onFinish={submitRemark}
          className="grid grid-cols-3 gap-3 clear-both"
        >
          <Form.Item>
            <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
              invoice_date
            </label>
            <Input disabled={true} value={current_selected?.invoice_date} />
          </Form.Item>
          <Form.Item>
            <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
              Item No
            </label>
            <Input disabled={true} value={current_selected?.item_no} />
          </Form.Item>
          <Form.Item>
            <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
              invoice_num
            </label>
            <Input disabled={true} value={current_selected?.invoice_num} />
          </Form.Item>
          <Form.Item>
            <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
              po_number
            </label>
            <Input disabled={true} value={current_selected?.po_number} />
          </Form.Item>
          <Form.Item>
            <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
              po_release
            </label>
            <Input disabled={true} value={current_selected?.po_release} />
          </Form.Item>
          <Form.Item>
            <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
              vendor
            </label>
            <Input disabled={true} value={current_selected?.vendor} />
          </Form.Item>
          <Form.Item>
            <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
              invoice_unit_price
            </label>
            <Input
              disabled={true}
              value={current_selected?.invoice_unit_price}
            />
          </Form.Item>
          <Form.Item>
            <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
              amount
            </label>
            <Input disabled={true} value={current_selected?.amount} />
          </Form.Item>
          <Form.Item>
            <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
              currency
            </label>
            <Input disabled={true} value={current_selected?.currency} />
          </Form.Item>
        </Form>
        <div className="grid grid-cols-1 gap-1 clear-both">
          <Form.Item>
            <label className="uppercase font-bold">write remark</label>
            <TextArea
              className="w-full"
              placeholder="remark here"
              value={remark}
              autoSize={{
                minRows: 6,
                maxRows: 12,
              }}
              onChange={(e) => setRemark(e.target.value)}
            />
            <Button
              htmlType="submit"
              disabled={remark != "" ? false : true}
              type="primary"
              style={{
                backgroundColor: remark ? "#006254" : "#eee",
              }}
              className="mt-5 text-[white] font-bold uppercase rounded-2xl border-solid border-2 border-[#006254]"
            >
              UPDATE
            </Button>
          </Form.Item>
        </div>
      </Drawer>
    </div>
  );
};
export default PriceReport;
