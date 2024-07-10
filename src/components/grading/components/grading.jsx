import { Button, DatePicker, Form, Table } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import schema from "../../../javascript/print_schema";
import { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetSummaryScore,
  setEvaMonth,
  setEvaluated_list,
} from "../../summary_score/actions/summary_scoreSlice";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
const GradingTable = ({ baseUrl, token_id, exportSummaryPDF }) => {
  const dispatch = useDispatch();
  const [filterSummaryForm] = useForm();
  //state
  const [pageSize, setPageSize] = useState(5);
  const summaryScore = useSelector((state) => state.summary_score);
  const convertToThaiBuddhistDate = (gregorianDate) => {
    let [year, month] = gregorianDate.split("-");

    // Convert year from string to integer
    year = parseInt(year, 10);

    // Thai Buddhist calendar is 543 years ahead of the Gregorian calendar
    let thaiYear = year + 543;

    // Return the Thai Buddhist date in the format YYYY-MM
    return `${thaiYear}-${month}`;
  };
  const clearFilter = async () => {
    dispatch(resetSummaryScore());
    filterSummaryForm.resetFields();
  };
  const manageFilter = async () => {
    const filter_summaryScore_payload = {
      summary_date: convertToThaiBuddhistDate(summaryScore?.filter_eva_month),
    };
    const response = await axios.post(
      `${baseUrl}/api/evaluate/summary_score/filter`,
      filter_summaryScore_payload,
      { headers: { Authorization: `Bearer ${token_id}` } }
    );
    if (response.status === 200) {
      filterSummaryForm.resetFields();
      dispatch(setEvaluated_list(response?.data));
    } else {
      filterSummaryForm.resetFields();
      dispatch(resetSummaryScore());
    }
  };
  let rowId = 0;
  let tableData = summaryScore?.evaluated_list.map((item) => {
    return {
      no: (rowId += 1),
      supplier: item?.SUPPLIER,
      percentage: item?.EVALUATE_PERCENT,
      grade: item?.EVALUATE_GRADE,
      comments: item?.EVALUATE_COMMENT,
    };
  });
  return (
    <>
      <div className="my-10" id="summaryScore">
        <div class="overflow-x-auto">
          <table class="sm:w-auto md:w-full border-collapse">
            <tbody>
              <tr class="bg-[#006254]">
                <td class="px-4 py-2" colspan="3">
                  <h1 class="text-center font-bold text-lg text-white">
                    เกณฑ์การให้คะแนน
                  </h1>
                </td>
              </tr>
              <tr>
                <td class="px-4 py-2 sm:w-1/3 text-center">เกรด</td>
                <td class="px-4 py-2 sm:w-1/4">
                  <center>คะแนน (%)</center>
                </td>
                <td class="px-4 py-2 sm:w-2/5 text-center">ผลสรุป</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-center">A</td>
                <td class="px-4 py-2 text-center">90-100</td>
                <td class="px-4 py-2 text-center">ดีมาก</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-center">B</td>
                <td class="px-4 py-2 text-center">80-89</td>
                <td class="px-4 py-2 text-center">ดี</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-center">C</td>
                <td class="px-4 py-2 text-center">70-79</td>
                <td class="px-4 py-2 text-center">พอใช้</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-center">D</td>
                <td class="px-4 py-2 text-center">น้อยกว่า 69</td>
                <td class="px-4 py-2 text-center">ปรับปรุง</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <Form
        onFinish={manageFilter}
        form={filterSummaryForm}
        initialValues={summaryScore}
      >
        <div className="flex flex-row">
          <Form.Item className="mr-5" name={"summary_date"}>
            <DatePicker
              className="w-[300px]"
              onChange={(date, dateString) => dispatch(setEvaMonth(dateString))}
              placeholder="Select Month & Year"
              picker="month"
            />
          </Form.Item>
          <Form.Item>
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
          </Form.Item>
          <Form.Item>
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
            <Button
              disabled={summaryScore?.evaluated_list.length > 0 ? false : true}
              className="uppercase ml-5"
              onClick={() =>
                exportSummaryPDF(tableData, summaryScore?.filter_eva_month)
              }
            >
              <div className="flex flex-row">
                <FilePdfOutlined className="mr-[10px] text-[20px]" />
                {"Save as PDF"}
              </div>
            </Button>
          </Form.Item>
        </div>
      </Form>
      <div className="mt-[10px] w-full">
        {/* <Table
          dataSource={tableData}
          columns={schema(tableData)}
          pagination={false}
        /> */}
        <Table
          className="w-full overflow-y-hidden"
          dataSource={tableData}
          columns={schema(tableData)}
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
export default memo(GradingTable);
