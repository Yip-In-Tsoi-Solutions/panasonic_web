import { DatePicker, Form } from "antd";
import moment from "moment";
import { setFilterResultPromiseStart } from "../actions/filterSlice";

const Promise_date_from = (props) => {
  //actions of Promise date Start
  const handlePromiseStartDate = (a, dateString) => {
    dispatch(setFilterResultPromiseStart(dateString));
  };
  return (
    <>
      <Form.Item label="Promise DATE FROM" name={"Promise DATE FROM"}>
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
