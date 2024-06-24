import { Form, Select } from "antd";
import { useDispatch } from "react-redux";
import { setSelect_VendorList } from "../../../pages/evaluate_form/actions/evaluate_formSlice";
const { Option } = Select;
const Supplier_Eva = ({ value, supplier_list }) => {
  const dispatch = useDispatch();
  const selectVendor = async (val) => {
    dispatch(setSelect_VendorList(val));
  };
  return (
    <>
      <br />
      <p className="text-[16px]">
        การประเมินการปฏิบัติงานผู้ส่งมอบด้านการให้บริการและการขนส่งวัตถุดิบ
      </p>
      <br />
      <div className="grid grid-cols-2 gap-2">
        <p className="text-[16px] float-left">ชื่อผู้ส่งมอบ (Supplier)</p>
        <Form.Item
          name={"Supplier"}
          className="float-left ml-10"
          rules={[
            {
              required: true,
              message: "Please select a Vendors",
            },
            // Add more rules as needed
          ]}
        >
          <Select
            placeholder={"เลือกรายชื่อ Supplier ที่ต้องการ"}
            value={value} // Set the value of the Select component
            onChange={selectVendor}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {supplier_list.map((item) => (
              <Option value={item.SUPPLIER} disabled={item.SUPPLIER === value}>{item.SUPPLIER}</Option>
            ))}
          </Select>
        </Form.Item>
      </div>
    </>
  );
};
export default Supplier_Eva;
