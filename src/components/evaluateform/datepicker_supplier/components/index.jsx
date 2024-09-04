import { Button, DatePicker, Form, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useDispatch } from "react-redux";
const { Option } = Select;
import { resetEValuate, setSelect_VendorList, setVendorList } from "../../../../pages/evaluate_form/actions/evaluate_formSlice";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
const DatePickerSupplier = ({
    url,
    token_id,
    dateFormat,
    month,
    moment,
    setSelectMonth,
    convert_year_th,
    value,
    supplier_list
}) => {
    const [datePickerForm] = useForm();
    const dispatch = useDispatch()

    const querySupplier = async (selected_date) => {
        if (selected_date !== 'NaN-undefined-00 00:00:00.000' && selected_date !== null) {
            let payload = {
                month: selected_date
            }
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
            setSelectMonth(selected_date)
        }
        else {
            dispatch(resetEValuate());
            dispatch(setVendorList([]));
            datePickerForm.resetFields()
        }
    }
    const selectVendor = async (val) => {
        dispatch(setSelect_VendorList(val));
    };
    return (
        <Form form={datePickerForm}>
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
                    ]}
                >
                    <DatePicker
                        allowClear={true}
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
            <div className="clear-both">
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
                        ]}
                    >
                        <Select
                            placeholder={"เลือกรายชื่อ Supplier ที่ต้องการ"}
                            value={value} // Set the value of the Select component
                            onChange={selectVendor}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            {supplier_list.map((item) => (
                                <Option value={item.SUPPLIER_NAME} disabled={item.SUPPLIER_NAME === value}>{item.SUPPLIER_NAME}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>
            </div>
        </Form>
    );
};
export default DatePickerSupplier;
