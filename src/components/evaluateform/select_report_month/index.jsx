import { DatePicker, Form } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { resetEValuate, setVendorList } from "../../../pages/evaluate_form/actions/evaluate_formSlice";
const ReportMonth = ({
  url,
  token_id,
  dateFormat,
  month,
  moment,
  convert_year_th,
}) => {
  const [datePickerForm] = useForm();
  const dispatch = useDispatch()
  const querySupplier = async (selected_date) => {
    if (selected_date !== null && selected_date !== '') {
      let payload = {
        month: selected_date
      }
      try {
        const response = axios.post(
          `${url}/api/evaluate/dropdown/supplier`,
          payload,
          {
            headers: { Authorization: `Bearer ${token_id}` },
          }
        );
        response.then((item) => {
          dispatch(setVendorList(item.data));
        })
      } catch (error) {
        dispatch(resetEValuate())
      }
    }
  }
  return (
    <Form form={datePickerForm} className="clear-both">
      <div className="float-left">
        <p className="text-[16px]">รายงานประจำเดือน</p>
      </div>
      <div className="float-right">
        <Form.Item
          name={"month"}
          rules={[
            {
              required: true,
              message: "Please select a Month",
            },
            // Add more rules as needed
          ]}
        >
          <DatePicker
            allowClear
            type="date"
            format={dateFormat}
            className="w-full"
            value={month !== "" ? moment(month, dateFormat) : ""}
            onChange={(a, dateString) =>
              querySupplier(convert_year_th(dateString))
            }
          />
        </Form.Item>
      </div>
    </Form>
  );
};
export default ReportMonth;
