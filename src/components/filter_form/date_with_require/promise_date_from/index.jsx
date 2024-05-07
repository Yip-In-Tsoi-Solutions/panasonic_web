import { DatePicker, Form } from "antd";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setFilterResultPromiseStart } from "../../actions/filterSlice";

const Promise_date_from = (props) => {
  const dispatch = useDispatch()
  //actions of Promise date Start
  const handlePromiseStartDate = (a, dateString) => {
    dispatch(setFilterResultPromiseStart(dateString));
  };
  return (
    <>
      <Form.Item label="DATE FROM" name={"DATE FROM"} rules={[
          {
            required: true,
            message: "Please select an DATE FROM",
          },
        ]}>
        <DatePicker
          type="date"
          format={props.dateFormat}
          className="w-full"
          value={
            props.promise_start_date !== ""
              ? moment(props.promise_start_date, props.dateFormat)
              : ""
          }
          onChange={handlePromiseStartDate}
        />
      </Form.Item>
    </>
  );
};
export default Promise_date_from;
