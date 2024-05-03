import { Button, DatePicker, Form } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilterResultPromiseEnd,
  setFilterResultPromiseStart,
} from "../actions/priceReportSlice";
import { useForm } from "antd/es/form/Form";

const PriceReport = () => {
  const [form] = useForm();
  const priceReport = useSelector((state) => state.priceReport);
  const disPatch = useDispatch();
  const dateFormat = "DD/MM/YYYY";
  const { promise_start_date, promise_end_date } =
    priceReport?.temp_state_filter;
  //actions of Promise date Start
  const handlePromiseStartDate = (a, dateString) => {
    disPatch(setFilterResultPromiseStart(dateString));
  };
  //actions of Promise date to
  const handlePromisetoDate = (a, dateString) => {
    disPatch(setFilterResultPromiseEnd(dateString));
  };
  const manageFilter = async (val) => {
    console.log(promise_start_date);
    console.log(promise_end_date);
  };
  const clearFilter = async () => {
    form.resetFields();
  };
  return (
    <div>
      <h1 className="text-2xl font-bold pl-0 p-3 mb-5">Price Report</h1>
      <Form
        onFinish={manageFilter}
        form={form}
        className="grid grid-cols-3 gap-3 clear-both"
      >
        <Form.Item label="Promise DATE FROM" name={"Promise DATE FROM"}>
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
        <Form.Item label="Promise DATE TO" name={"Promise DATE TO"}>
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
    </div>
  );
};
export default PriceReport;
