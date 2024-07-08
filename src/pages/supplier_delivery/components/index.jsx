import { Button, Form, Table, message } from "antd";
import { memo, useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "antd/es/form/Form";
import schema from "../../../javascript/print_schema";
import SupplierDeliveryConfirm from "../../../components/SupplierDeliveryConfirm/components/confirm_btn";
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
import convertDateFormat from "../../../javascript/convertDateFormat";

// class components
const Supplier_delivery = (props) => {
  // redux/Antd
  const dispatch = useDispatch();
  const [form] = useForm();
  // state
  const [pageSize, setPageSize] = useState(5);
  const [confirmBtnStatus, setConfirm] = useState(true);
  const filter = useSelector((state) => state.filter);
  const [suppliery_list_filter_result, setSuppliery_list_filter_result] =
    useState([]);
  const [export_datasetAPI, setExportDataset] = useState([]);
  // date formato f date start & date end
  const dateFormat = "DD/MM/YYYY";
  const { promise_start_date, promise_end_date, buyer, vendor, purchaseNo } =
    filter?.temp_state_filter;
  let queryString = "";
  const manageFilter = async (val) => {
    try {
      if (buyer != "") {
        queryString += `LOWER([Buyer]) = ${JSON.stringify(buyer).toLowerCase().replace(/"/g, "'")}`;
      }
      if (promise_start_date != "" && promise_end_date != "") {
        queryString += ` AND convert(nvarchar(10), [PROMISED_DATE], 120) BETWEEN ${JSON.stringify(
          convertDateFormat(promise_start_date)
        ).replace(/"/g, "'")} AND ${JSON.stringify(
          convertDateFormat(promise_end_date)
        ).replace(/"/g, "'")}`;
      }
      if (vendor != "") {
        queryString += ` AND LOWER([SUPPLIER]) = ${JSON.stringify(vendor).toLowerCase().replace(
          /"/g,
          "'"
        )}`;
      }
      if (purchaseNo != "") {
        queryString += ` AND [PO_NUMBER] = ${purchaseNo}`;
      }
      const response = await axios.post(
        `${props.baseUrl}/api/supplier_list_filter_optional`,
        {
          queryString,
        },
        {
          headers: {
            Authorization: `Bearer ${props.token_id}`,
          },
        }
      );
      dispatch(resetAllState());
      if (response.status === 200) {
        setSuppliery_list_filter_result(response.data);
        const exportAPI = await axios.post(
          `${props.baseUrl}/api/supplier_list/export_file`,
          {
            queryString,
          },
          {
            headers: {
              Authorization: `Bearer ${props.token_id}`,
            },
          }
        );
        if (exportAPI.status === 200) {
          setExportDataset(exportAPI.data);
          setConfirm(false);
          form.resetFields();
          dispatch(resetAllState());
        }
      }
    } catch (error) {
      if (error) {
        window.location.href = "/error_not_found";
      }
    }
  };

  // actions of Clear filter
  const clearFilter = () => {
    form.resetFields();
    setSuppliery_list_filter_result([]);
    dispatch(resetAllState());
    setConfirm(true);
  };
  return (
    <>
      <div>
        <div className="float-left">
          <h1 className="text-2xl font-bold pl-0 p-3 uppercase">
            Supplier Delivery Report
          </h1>
          <p className="text-left text-[red]">
            *** Data will show when the actual delivery date differs from the
            promised date ***
            {/* <strong className="underline uppercase">diff</strong> only */}
          </p>
          <br />
        </div>
        <div className="flex flex-row float-right">
          <SupplierDeliveryConfirm
            baseUrl={props.baseUrl}
            payload={export_datasetAPI}
            confirmBtnStatus={confirmBtnStatus}
            setConfirm={setConfirm}
            token_id={props.token_id}
          />
        </div>
      </div>
      <Form onFinish={manageFilter} form={form} className="uppercase">
        <div className="grid grid-cols-3 gap-3 gap-y-0 clear-both">
          <Buyer_filter pageTitle={props.page_title} token_id={props.token_id} baseUrl={props.baseUrl} />
          <Promise_date_from
            dateFormat={dateFormat}
            promise_start_date={promise_start_date}
          />
          <Promise_date_to
            dateFormat={dateFormat}
            promise_start_date={promise_start_date}
          />
          <Vendor_filter token_id={props.token_id} baseUrl={props.baseUrl} />
          <PurchaseOrder_filter
            token_id={props.token_id}
            baseUrl={props.baseUrl}
          />
        </div>
        <Form.Item className="grid grid-cols-3 gap-3 gap-y-0">
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
              export_fileName={"supplier_delivery"}
              dataset={export_datasetAPI}
            />
          </div>
        </Form.Item>
      </Form>
      <div className="clear-both mt-5">
        <Table
          className="w-full overflow-y-hidden"
          dataSource={suppliery_list_filter_result}
          columns={schema(suppliery_list_filter_result)}
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
      </div>
    </>
  );
};
export default memo(Supplier_delivery);
