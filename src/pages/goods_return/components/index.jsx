import { useState } from "react";
import { Button, Drawer, Form, Input, InputNumber, Table, Tooltip } from "antd";
import { useForm } from "antd/es/form/Form";
import Promise_date_from from "../../../components/filter_form/date_with_require/promise_date_from";
import Promise_date_to from "../../../components/filter_form/date_with_require/promise_date_to";
import { useDispatch, useSelector } from "react-redux";
import { setBuyer_reason } from "../../buyer_reason/actions/buyer_reasonSlice";
import { resetAllState } from "../../../components/filter_form/actions/filterSlice";
import Supplier_filter from "../../../components/filter_form/supplier_filter_require";
import PurchaseOrder_filter from "../../../components/filter_form/purchaseOrder_filter";
import axios from "axios";
import schema from "../../../javascript/print_schema";
import { setGoodsList } from "../actions/goods_returnSlice";
const GoodsReturn = (props) => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const dateFormat = "DD/MM/YYYY";
  const [curentSelect, setCurrent] = useState({
    po_number: 0,
    po_release: 0,
    item_no: "",
    description: "",
    unit: "",
    return_qty: 0,
    unitPrice: 0,
    curency: "",
    cause: "",
    invoice_no: 0,
    invoice_date: "",
  });
  const [returnForm, setReturnForm] = useState(false);
  const goods_return_list = useSelector(
    (state) => state.goods_return_list.goodsList
  );
  const filter = useSelector((state) => state.filter);
  const { promise_start_date, promise_end_date, vendor, purchaseNo } =
    filter?.temp_state_filter;
  const clearFilter = () => {
    form.resetFields();
    dispatch(setBuyer_reason([]));
    dispatch(resetAllState());
  };
  // Action of submit for filter
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
      if (vendor != "") {
        queryString += `AND VENDOR_NAME = ${JSON.stringify(vendor).replace(
          /"/g,
          "'"
        )}`;
      }
      if (purchaseNo != "") {
        queryString += `AND PO_NUMBER = ${JSON.stringify(purchaseNo).replace(
          /"/g,
          "'"
        )}`;
      }
      const response = await axios.post(
        `${props.baseUrl}/api/matching_invoice`,
        {
          queryString,
        }
      );
      if (response.status === 200) {
        dispatch(setGoodsList(response.data));
      } else {
        dispatch(setGoodsList(...goods_return_list));
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Action of open & setPayload
  const openForm = (item) => {
    setCurrent(
      (prevState) => ({
        ...prevState,
        po_number: item?.PO_NUMBER,
        po_release: item?.PO_RELEASE,
        item_no: item?.ITEM_CODE,
        description: item?.DESCRIPTION,
        unit: item?.UOM,
        unitPrice: item?.INV_UNIT_PRICE,
        curency: item?.INV_CURRENCY_CODE,
        invoice_no: item?.INVOICE_NUM,
        invoice_date: item?.INVOICE_DATE,
      }),
      [curentSelect]
    );
    setReturnForm(true);
  };
  const submitReturnForm = async () => {
    let payload = {
      curentSelect,
    };
    console.log(payload?.curentSelect);
  };
  return (
    <>
      <h1 className="text-2xl font-bold pl-0 p-3 mb-5">Goods Return</h1>
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
        <Supplier_filter baseUrl={props.baseUrl}/>
        <PurchaseOrder_filter baseUrl={props.baseUrl}/>
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
      <Table
        className="clear-both overflow-y-hidden"
        dataSource={goods_return_list}
        columns={[
          {
            title: "Action".toUpperCase(),
            key: "action",
            render: (record) => (
              <>
                <Tooltip placement="top" title={"Goods Return".toUpperCase()}>
                  <Button
                    onClick={openForm.bind(this, record)}
                    className="uppercase"
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      boxShadow: "none",
                    }}
                  >
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
                        d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                      />
                    </svg>
                  </Button>
                </Tooltip>
              </>
            ),
          },
        ].concat(schema(goods_return_list))}
      />
      <div className="clear-both">
        <Drawer
          title={"goods return Form".toUpperCase()}
          onClose={() => setReturnForm(false)}
          open={returnForm}
          width={window.innerWidth / 1.5}
        >
          <h1 className="italic uppercase">information of goods return</h1>
          <Form form={form} onFinish={submitReturnForm}>
            <div className="grid grid-cols-3 gap-3 clear-both">
              <Form.Item>
                <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
                  PO_NUMBER
                </label>
                <Input disabled={true} value={curentSelect?.po_number} />
              </Form.Item>
              <Form.Item>
                <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
                  po_release
                </label>
                <Input disabled={true} value={curentSelect?.po_release} />
              </Form.Item>
              <Form.Item>
                <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
                  item_no
                </label>
                <Input disabled={true} value={curentSelect?.item_no} />
              </Form.Item>
              <Form.Item>
                <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
                  description
                </label>
                <Input disabled={true} value={curentSelect?.description} />
              </Form.Item>
              <Form.Item>
                <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
                  uom
                </label>
                <Input disabled={true} value={curentSelect?.unit} />
              </Form.Item>
              <Form.Item>
                <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
                  unit price
                </label>
                <Input disabled={true} value={curentSelect?.unitPrice} />
              </Form.Item>
              <Form.Item>
                <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
                  curency
                </label>
                <Input disabled={true} value={curentSelect?.curency} />
              </Form.Item>
              <Form.Item>
                <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
                  invoice_no
                </label>
                <Input disabled={true} value={curentSelect?.invoice_no} />
              </Form.Item>
              <Form.Item>
                <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
                  invoice date
                </label>
                <Input disabled={true} value={curentSelect?.invoice_date} />
              </Form.Item>
              <Form.Item>
                <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
                  return_qty
                </label>
                <InputNumber
                  className="w-full"
                  min={0}
                  defaultValue={1}
                  onChange={(e) =>
                    setCurrent((prevState) => ({
                      ...prevState,
                      return_qty: e,
                    }))
                  }
                />
                {/* <Input disabled={true} value={curentSelect?.return_qty} /> */}
              </Form.Item>
              <Form.Item>
                <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
                  remarks
                </label>
                <Input
                  value={curentSelect.cause} // Assuming currentState is your state object
                  onChange={(e) =>
                    setCurrent((prevState) => ({
                      ...prevState,
                      cause: e.target.value,
                    }))
                  }
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item>
                <Button htmlType="submit">Submit</Button>
              </Form.Item>
            </div>
          </Form>
        </Drawer>
      </div>
    </>
  );
};
export default GoodsReturn;
