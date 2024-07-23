import { FileExcelOutlined, FileTextOutlined } from "@ant-design/icons";
import { CSVDownload, CSVLink } from "react-csv";
import { Button, Form, Modal } from "antd";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "antd/es/form/Form";
import Promise_date_from from "../../filter_form/date_with_require/promise_date_from";
import Promise_date_to from "../../filter_form/date_with_require/promise_date_to";
import axios from "axios";
import convertDateFormat from "../../../javascript/convertDateFormat";

// saving to Excel
const exportToXlsx = (data, filename) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Convert the data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Generate a buffer
  const workbookOut = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Create a Blob object and save it
  const blob = new Blob([workbookOut], { type: "application/octet-stream" });
  saveAs(blob, `${filename}.xlsx`);
};

// UI Components
const Export_All = (props) => {
  // State
  const dateFormat = "DD/MM/YYYY";
  const [exportAll] = useForm();
  const { token_id, export_fileName } = props;
  const [modal, setModal] = useState(false);
  const filter = useSelector((state) => state.filter);
  const { promise_start_date, promise_end_date } = filter?.temp_state_filter;
  const [dataset, setData] = useState([]);
  // Components ACTION
  const manageFilter = async () => {
    let queryString = "";
    if (promise_start_date != "" && promise_end_date != "") {
      queryString += `convert(nvarchar(10), [PROMISED_DATE], 120) BETWEEN ${JSON.stringify(
        convertDateFormat(promise_start_date)
      ).replace(/"/g, "'")} AND ${JSON.stringify(
        convertDateFormat(promise_end_date)
      ).replace(/"/g, "'")}`;
    }
    const response = await axios.post(
      props.api_url,
      { queryString },
      {
        headers: {
          Authorization: `Bearer ${token_id}`,
        },
      }
    );
    if (response.status === 200) {
      exportToXlsx(response.data, export_fileName);
    }
  };
  return (
    <>
      <div className="flex flex-row">
        <Button
          onClick={() => setModal(true)}
          className="ml-5 uppercase"
        >
          <div className="flex flex-row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
              />
            </svg>
            EXPORT ALL DATA
          </div>
        </Button>
      </div>
      <Modal open={modal} footer={null} onCancel={() => setModal(false)}>
        <Form onFinish={manageFilter} form={exportAll} className="m-6">
          <Form.Item>
            <Promise_date_from
              dateFormat={dateFormat}
              promise_start_date={promise_start_date}
              className="w-full"
            />
            <Promise_date_to
              dateFormat={dateFormat}
              promise_end_date={promise_end_date}
              className="w-full"
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              style={{ backgroundColor: "#016255", color: "white" }}
            >
              EXPORT
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default Export_All;
