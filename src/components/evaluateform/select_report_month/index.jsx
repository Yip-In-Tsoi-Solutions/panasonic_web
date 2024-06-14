import { DatePicker, Form } from "antd";

const ReportMonth = ({
  dateFormat,
  month,
  moment,
  setSelectMonth,
  convert_year_th,
}) => {
  return (
    <div className="clear-both">
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
            type="date"
            format={dateFormat}
            className="w-full"
            value={month !== "" ? moment(month, dateFormat) : ""}
            onChange={(a, dateString) =>
              setSelectMonth(convert_year_th(dateString))
            }
          />
        </Form.Item>
      </div>
    </div>
  );
};
export default ReportMonth;
