import { DatePicker, Form } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

const PriceReport = () => {
  const suppliery_list = useSelector((state) => state.supplier_delivery_report);
  const disPatch = useDispatch();
  const dateFormat = "DD/MM/YYYY";
  const { promise_start_date, promise_end_date } =
    suppliery_list?.temp_state_filter;
  //actions of Promise date Start
  const handlePromiseStartDate = (a, dateString) => {
    disPatch(setFilterResultPromiseStart(dateString));
  };
  //actions of Promise date to
  const handlePromisetoDate = (a, dateString) => {
    disPatch(setFilterResultPromiseEnd(dateString));
  };
  return (
    <div>
      <h1 className="text-2xl font-bold pl-0 p-3 mb-5">Price Report</h1>
      <Form className="grid grid-cols-3 gap-3 clear-both">
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
      </Form>
    </div>
  );
};
export default PriceReport;
