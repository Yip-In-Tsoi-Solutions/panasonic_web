import { Button, Form, Modal, Select, Table, message } from "antd";
import { memo, useMemo, useState } from "react";
import {
  resetAllState,
  setFilterBuyer,
  setFilterP0,
  setFilterResultBuyer,
  setFilterResultPO,
  setFilterResultVendor,
  setFilterVendor,
  setSupplieryList,
} from "../../../components/filter_form/actions/filterSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "antd/es/form/Form";
import schema from "../../../javascript/print_schema";
import Export from "../../../components/export_data";
const { Option } = Select;
// class components
const Original_delivery = (props) => {
  // redux/Antd
  const dispatch = useDispatch();
  const [form] = useForm();
  const [
    original_delivery_report_filter_result,
    setOriginal_delivery_report_filter_result,
  ] = useState([]);
  // state
  const [pageSize, setPageSize] = useState(5);
  const [export_datasetAPI, setExportDataset] = useState([]);
  const original_delivery_report = useSelector((state) => state.filter);
  async function fetchDropdownBuyer() {
    try {
      const response = await axios.get(
        `${props.baseUrl}/api/original_delivery_report/dropdown/buyer`,
        {
          headers: {
            Authorization: `Bearer ${props.token_id}`,
          },
        }
      );
      response.status === 200
        ? dispatch(setFilterBuyer(response.data))
        : dispatch(setFilterBuyer(...original_delivery_report?.filterBuyer));
    } catch (error) {
      if (error) {
        window.location.href = "/error_login";
      }
    }
  }
  async function fetchDropdownVendor() {
    try {
      const response = await axios.get(
        `${props.baseUrl}/api/original_delivery_report/dropdown/vendor`,
        {
          headers: {
            Authorization: `Bearer ${props.token_id}`,
          },
        }
      );
      response.status === 200
        ? dispatch(setFilterVendor(response.data))
        : dispatch(setFilterVendor(...original_delivery_report?.filterVendor));
    } catch (error) {
      if (error) {
        window.location.href = "/error_login";
      }
    }
  }
  async function fetchDropdownPoNumber() {
    try {
      const response = await axios.get(
        `${props.baseUrl}/api/original_delivery_report/dropdown/po_number`,
        {
          headers: {
            Authorization: `Bearer ${props.token_id}`,
          },
        }
      );
      response.status === 200
        ? dispatch(setFilterP0(response.data))
        : dispatch(setFilterP0(...original_delivery_report?.filterPO));
    } catch (error) {
      if (error) {
        window.location.href = "/error_login";
      }
    }
  }
  useMemo(() => {
    fetchDropdownBuyer();
    fetchDropdownVendor();
    fetchDropdownPoNumber();
  }, []);
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
  const { buyer, vendor, purchaseNo } =
    original_delivery_report?.temp_state_filter;
  const clearFilter = () => {
    form.resetFields();
    dispatch(setSupplieryList([]));
    setOriginal_delivery_report_filter_result([]);
    dispatch(resetAllState());
  };
  const manageFilter = async (val) => {
    try {
      let queryString = "";
      if (buyer != "") {
        queryString += `LOWER([Buyer]) = ${JSON.stringify(buyer).toLowerCase().replace(/"/g, "'")}`;
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
        `${props.baseUrl}/api/original_delivery_report/supplier_list_filter_optional`,
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
        setOriginal_delivery_report_filter_result(response.data);
        dispatch(resetAllState());
        form.resetFields()
      }
    } catch (error) {
      if (error) {
        window.location.href = "/error_not_found";
      }
    }
  }
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold pl-0 p-3 mb-5 uppercase">
          Original Delivery Report
        </h1>
      </div>
      <Form
        onFinish={manageFilter}
        form={form}
        className="grid grid-cols-3 gap-3 gap-y-0 clear-both"
      >
        <Form.Item
          label={"Buyer"}
          name={`buyer_${props.page_title}`}
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
              <Option key={item.Buyer} value={item.Buyer} disabled={item.Buyer === original_delivery_report.temp_state_filter.buyer}>
                {item.Buyer}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="SUPPLIER" name={`SUPPLIER_${props.page_title}`}>
          <Select
            value={original_delivery_report.temp_state_filter.vendor} // Set the value of the Select component
            onChange={handleVendorChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {original_delivery_report?.filterVendor.map((item) => (
              <Option key={item.SUPPLIER} value={item.SUPPLIER} disabled={item.SUPPLIER === original_delivery_report.temp_state_filter.vendor}>
                {item.SUPPLIER}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="PO Numbers" name={`PO_Numbers_${props.page_title}`}>
          <Select
            value={original_delivery_report.temp_state_filter.purchaseNo} // Set the value of the Select component
            onChange={handlePOChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {original_delivery_report?.filterPO.map((item) => (
              <Option key={item.PO_NUMBER} value={item.PO_NUMBER} disabled={item.PO_NUMBER === original_delivery_report.temp_state_filter.purchaseNo}>
                {item.PO_NUMBER}
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
              export_fileName={"Original_Delivery"}
              dataset={original_delivery_report_filter_result}
            />
          </div>
        </Form.Item>
      </Form>
      <div className="clear-both">
        <Table
          className="w-full overflow-y-hidden"
          dataSource={original_delivery_report_filter_result}
          columns={schema(original_delivery_report_filter_result)}
          scroll={{ x: "max-content" }}
          pagination={{
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
export default memo(Original_delivery);
