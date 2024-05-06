import { Button, Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "antd/es/form/Form";
import Promise_date_from from "../../../components/filter_form/promise_date_from";
import Promise_date_to from "../../../components/filter_form/promise_date_to";
import {
  resetPromiseEndDateFilter,
  resetPromiseStartDateFilter,
} from "../../../components/filter_form/actions/filterSlice";

const PriceReport = () => {
  const [form] = useForm();
  const priceReport = useSelector((state) => state.priceReport);
  const filter = useSelector((state) => state?.filter?.temp_state_filter);
  const dispatch = useDispatch();
  const dateFormat = "DD/MM/YYYY";
  const { promise_start_date, promise_end_date } = filter;
  const manageFilter = async (val) => {
    console.log(promise_start_date);
    console.log(promise_end_date);
  };
  const clearFilter = async () => {
    form.resetFields();
    dispatch(resetPromiseStartDateFilter());
    dispatch(resetPromiseEndDateFilter());
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
    </div>
  );
};
export default PriceReport;
