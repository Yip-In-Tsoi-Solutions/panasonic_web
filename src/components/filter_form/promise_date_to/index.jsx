import { DatePicker, Form } from "antd";
import moment from "moment";
import { setFilterResultPromiseEnd } from "../actions/filterSlice";
import { useDispatch } from "react-redux";
import { memo } from "react";

const Promise_date_to = (props) => {
  const dispatch = useDispatch()
  //actions of Promise date to
  const handlePromisetoDate = (a, dateString) => {
    dispatch(setFilterResultPromiseEnd(dateString));
  };
  return (
    <>
      <Form.Item label="DATE TO" name={"DATE TO"}>
        <DatePicker
          type="date"
          format={props.dateFormat}
          className="w-full"
          value={
            props.promise_end_date !== ""
              ? moment(props.promise_end_date, props.dateFormat)
              : ""
          }
          onChange={handlePromisetoDate}
        />
      </Form.Item>
    </>
  );
};
export default memo(Promise_date_to);
