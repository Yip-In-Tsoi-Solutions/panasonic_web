import { memo, useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  List,
  Table,
  Tooltip,
} from "antd";
import { useForm } from "antd/es/form/Form";
import Promise_date_from from "../../../components/filter_form/date_with_require/promise_date_from";
import Promise_date_to from "../../../components/filter_form/date_with_require/promise_date_to";
import { useDispatch, useSelector } from "react-redux";
import { setBuyer_reason } from "../../buyer_reason/actions/buyer_reasonSlice";
import { resetAllState } from "../../../components/filter_form/actions/filterSlice";
import Supplier_filter from "../../../components/filter_form/supplier_filter_require";
import ItemNo_filter_typing from "../../../components/filter_form/item_number_filter_typing";
import PurchaseOrder_filter from "../../../components/filter_form/purchaseOrder_filter";
import axios from "axios";
import schema from "../../../javascript/print_schema";
import {
  removeDocs,
  resetGoodsForm,
  setCause,
  setGoodsList,
  setReturnDoc,
  setReturnQty,
} from "../actions/goods_returnSlice";
import Export from "../../../components/export_data";
import convertDateFormat from "../../../javascript/convertDateFormat";
import Goods_return_pdf from "../../../components/generate_pdf/goods_return_pdf/components";
const GoodsReturn = (props) => {
  const [filter_form] = useForm();
  const [return_qty_form] = useForm();
  const dispatch = useDispatch();
  const dateFormat = "DD/MM/YYYY";
  const [curentSelect, setCurrent] = useState({
    id: 0,
    returnId: "",
    supplier: "",
    po_number: 0,
    po_release: 0,
    item_no: "",
    description: "",
    unit: "",
    unitPrice: 0,
    batchName: "",
    curency: "",
    invoice_no: 0,
    inv_qty: 0,
    invoice_date: "",
    return_line_no: 0,
  });
  const [tabView, setTabView] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [return_doc, setDoc] = useState("");
  const [return_number, setReturnNo] = useState([]);
  const [returnForm, setReturnForm] = useState(false);
  const goods_return_list = useSelector((state) => state.goods_return_list);
  const filter = useSelector((state) => state.filter);
  const { promise_start_date, promise_end_date, vendor, purchaseNo } =
    filter?.temp_state_filter;
  const clearFilter = () => {
    filter_form.resetFields();
    return_qty_form.resetFields();
    dispatch(setBuyer_reason([]));
    dispatch(setGoodsList([]));
    dispatch(resetAllState());
    setTabView(...tabView);
  };
  // Action of submit for filter
  const manageFilter = async () => {
    try {
      let queryString = "";
      if (promise_start_date != "" && promise_end_date != "") {
        queryString += `convert(nvarchar(10), [INVOICE_DATE], 120) BETWEEN ${JSON.stringify(
          convertDateFormat(promise_start_date)
        ).replace(/"/g, "'")} AND ${JSON.stringify(
          convertDateFormat(promise_end_date)
        ).replace(/"/g, "'")}`;
      }
      if (vendor != "") {
        queryString += `AND VENDOR_NAME = ${JSON.stringify(vendor).replace(
          /"/g,
          "'"
        )}`;
      }
      if (filter?.itemNo != "") {
        queryString += `AND lower([ITEM]) like ${JSON.stringify(
          filter?.itemNo.slice(0, 2) + "%"
        )
          .toLowerCase()
          .replace(/"/g, "'")}`;
      }
      if (purchaseNo != "") {
        queryString += `AND PO_NUMBER = ${JSON.stringify(purchaseNo).replace(
          /"/g,
          "'"
        )}`;
      }
      dispatch(resetAllState());
      const response = await axios.post(
        `${props.baseUrl}/api/matching_invoice`,
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
        filter_form.resetFields();
        dispatch(setGoodsList(response.data));
        setTabView(1);
      }
    } catch (error) {
      if (error) {
        window.location.href = "/error_not_found";
      }
    }
  };
  const fetch_return_number = async () => {
    try {
      const response = await axios.get(
        `${props.baseUrl}/api/matching_invoice/form/docs_no`,
        {
          headers: {
            Authorization: `Bearer ${props.token_id}`,
          },
        }
      );
      if (response.status === 200) {
        setReturnNo(response?.data);
      }
    } catch (error) {
      if (error) {
        window.location.href = "/error_login";
      }
    }
  };
  useEffect(() => {
    fetch_return_number();
  }, []);
  // Action of open & setPayload
  const openForm = (item) => {
    setCurrent(
      (prevState) => ({
        ...prevState,
        id: item?.ID,
        returnId: return_number[0].RETURN_NO,
        supplier: item?.SUPPLIER,
        po_number: item?.PO_NUMBER,
        po_release: item?.PO_RELEASE,
        item_no: item?.ITEM_CODE,
        description: item?.DESCRIPTION,
        batchName: item?.BATCH_NAME,
        unit: item?.UOM,
        inv_qty: item?.INV_QTY,
        unitPrice: item?.UNIT_PRICE,
        curency: item?.INV_CURRENCY_CODE,
        invoice_no: item?.INVOICE_NUM,
        invoice_date: item?.INVOICE_DATE,
        return_line_no: parseInt(item?.LINE_NUM),
      }),
      [curentSelect]
    );
    setReturnForm(true);
  };
  const submitReturnForm = async () => {
    try {
      let goods_data = {
        goods_return_form: curentSelect,
      };
      const payload = {
        ...goods_data.goods_return_form,
        ...{
          return_qty: parseInt(
            goods_return_list?.temp_state_filter?.return_qty
          ),
        },
        ...{ cause: goods_return_list?.temp_state_filter?.cause },
      };
      if (payload.supplier != "") {
        setDoc(payload.supplier);
      }
      dispatch(setReturnDoc(payload));
      setReturnForm(false);
      dispatch(resetAllState());
      setCurrent("");
      return_qty_form.resetFields();
      dispatch(resetGoodsForm());
    } catch (error) {
      if (error) {
        window.location.href = "/error_login";
      }
    }
  };
  return (
    <>
      <h1 className="text-2xl font-bold pl-0 p-3 mb-5 uppercase">
        Goods Return
      </h1>
      <Form
        onFinish={manageFilter.bind(this)}
        form={filter_form}
        className="grid grid-cols-3 gap-3 gap-y-0 clear-both"
      >
        <Promise_date_from
          dateFormat={dateFormat}
          promise_start_date={promise_start_date}
        />
        <Promise_date_to
          dateFormat={dateFormat}
          promise_start_date={promise_start_date}
        />
        <Supplier_filter
          pageTitle={props.page_title}
          token_id={props.token_id}
          baseUrl={props.baseUrl}
        />
        <ItemNo_filter_typing
          token_id={props.token_id}
          baseUrl={props.baseUrl}
        />
        <PurchaseOrder_filter
          pageTitle={props.page_title}
          token_id={props.token_id}
          baseUrl={props.baseUrl}
        />
        <Form.Item>
          <div className="flex flex-row ml-5">
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
      <div className="flex flex-row">
        <Export
          baseUrl={props.baseUrl}
          export_fileName={"Goods_reurn"}
          dataset={goods_return_list?.goodsList}
        />
      </div>
      <div className="mt-5 mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul
          className="flex flex-wrap -mb-px text-sm font-medium text-center"
          id="default-styled-tab"
          data-tabs-toggle="#default-styled-tab-content"
          data-tabs-active-classes="text-purple-600 hover:text-purple-600 dark:text-purple-500 dark:hover:text-purple-500 border-purple-600 dark:border-purple-500"
          data-tabs-inactive-classes="dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300"
          role="tablist"
        >
          {[
            { label: "preview".toUpperCase(), pageId: 1 },
            { label: "Return Docs".toUpperCase(), pageId: 2 },
          ].map((page) => (
            <li key={page?.pageId} className="me-2" role="presentation">
              <button
                className="inline-block p-4 border-b-2 rounded-t-lg"
                id="profile-styled-tab"
                data-tabs-target="#styled-profile"
                type="button"
                role="tab"
                aria-controls="profile"
                aria-selected="false"
                onClick={() => setTabView(page?.pageId)}
              >
                {page?.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div id="default-styled-tab-content">
        {tabView === 1 && (
          <Table
            className="clear-both overflow-y-hidden mt-5"
            dataSource={goods_return_list.goodsList}
            columns={[
              {
                title: "Action".toUpperCase(),
                key: "action",
                render: (record) => (
                  <>
                    <Tooltip
                      placement="top"
                      title={"Goods Return".toUpperCase()}
                    >
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
            ].concat(schema(goods_return_list?.goodsList))}
            scroll={{ x: "max-content" }}
            pagination={{
              pageSize: pageSize, // Set the initial page size
              defaultPageSize: 5,
              pageSizeOptions: ["5", "10", "20", "50", "100", "200"],
              onShowSizeChange: (current, size) => setPageSize(size), // Function to handle page size changes
              position: ["bottomCenter"],
            }}
          />
        )}
        {tabView === 2 && (
          <>
            <div className="float-right">
              <Goods_return_pdf
                token_id={props.token_id}
                page_title={props?.page_title}
                return_doc={return_number[0].RETURN_NO}
                baseUrl={props.baseUrl}
                dataset={goods_return_list.return_doc.filter(
                  (i) => i.supplier === return_doc
                )}
              />
            </div>
            <List
              dataSource={goods_return_list.return_doc.filter(
                (i) => i.supplier === return_doc
              )}
              renderItem={(item) => (
                <List.Item key={item?.item_no}>
                  <List.Item.Meta
                    title={
                      <h1 style={{ fontSize: 16 }} className="font-bold">
                        {item?.supplier} ({item?.item_no})
                      </h1>
                    }
                    description={
                      <div className="flex flex-row mb-5 uppercase w-full">
                        <p className="mr-5">
                          รหัสสินค้า / ITEM CODE : {item?.item_no}
                        </p>
                        <p className="mr-5">จำนวนที่คืน / return qty : </p>
                        <InputNumber
                          size="small"
                          className="w-[100px] h-24px ml-5 mr-5"
                          min={0}
                          defaultValue={item?.return_qty}
                        />
                        <p>เหตุผลที่คืน / cause : </p>
                        <Input
                          size="small"
                          className="w-[200px] h-24px ml-5 mr-5"
                          defaultValue={item?.cause}
                        />
                        <svg
                          onClick={() => dispatch(removeDocs())}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6 text-[black] cursor-pointer"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </>
        )}
      </div>

      <div className="clear-both">
        <Drawer
          title={"goods return Form".toUpperCase()}
          onClose={() => setReturnForm(false)}
          open={returnForm}
          width={window.innerWidth / 1.5}
        >
          <h1 className="italic uppercase">information of goods return</h1>
          <Form form={return_qty_form} onFinish={submitReturnForm.bind(this)}>
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
                  value={goods_return_list?.temp_state_filter?.return_qty}
                  defaultValue={0}
                  onChange={(value) => dispatch(setReturnQty(value))}
                />
              </Form.Item>
              <Form.Item>
                <label className="block mb-2 text-sm text-gray-900 dark:text-white uppercase font-bold">
                  cause
                </label>
                <Input
                  value={goods_return_list?.temp_state_filter?.cause}
                  onChange={(e) => dispatch(setCause(e.target.value))}
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
export default memo(GoodsReturn);
