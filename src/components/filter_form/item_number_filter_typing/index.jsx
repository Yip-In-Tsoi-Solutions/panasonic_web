import { Form, Input } from "antd";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setItemNo } from "../actions/filterSlice";
import axios from "axios";

const ItemNo_filter_typing = (props) => {
  const dispatch = useDispatch();
  return (
    <>
      <Form.Item label="ItemNo" name={"Item_no_typing"}>
        <Input onChange={(e) => dispatch(setItemNo(e.target.value))} />
      </Form.Item>
    </>
  );
};
export default memo(ItemNo_filter_typing);
