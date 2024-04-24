import { Button, Card, Col, Form, List, Radio, Row, Select, Table } from "antd";
import { useForm } from "antd/es/form/Form";
import { useMemo, useState } from "react";
import schema from "../../../javascript/print_schema";
import {
  setForm,
  setSelect_VendorList,
  setVendorList,
} from "../actions/evaluate_formSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { render } from "react-dom";
import TextArea from "antd/es/input/TextArea";
const { Option } = Select;

const Evaluate_form = () => {
  // action
  const [form] = useForm();
  const dispatch = useDispatch();
  // state
  const evaluate_vendors = useSelector((state) => state.evaluate_vendors);
  const [month, setSelectMonth] = useState("");
  const [score, setScore] = useState(0);
  const [comments, setComment] = useState("");
  async function fetchDropdownVendor() {
    try {
      const response = await axios.get("/api/dropdown/vendor");
      response.status === 200
        ? dispatch(setVendorList(response.data))
        : dispatch(setVendorList(...evaluate_vendors?.vendor_list));
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchEvaluateTopic() {
    try {
      const response = await axios.get("/api/evaluate/topic");
      response.status === 200
        ? dispatch(setForm(response.data))
        : dispatch(setForm(...evaluate_vendors?.evaluate_form));
    } catch (error) {
      console.log(error);
    }
  }
  useMemo(() => {
    fetchEvaluateTopic();
    fetchDropdownVendor();
  }, []);
  const selectVendor = async (val) => {
    dispatch(setSelect_VendorList(val));
  };
  const { vendor } = evaluate_vendors.temp_state_filter;
  const companyName = "PANASONIC ENERGY (THAILAND) CO.,LTD";
  // radio button for Scoring
  const handleScoreChange = (record, e) => {
    const { title } = record;
    const selectedValue = e.target.value;
    if (score[title] !== selectedValue) {
      setScore({ ...score, [title]: selectedValue });
    }
  };
  const getTotal = () => {
    let total = 0;
    for (const key in score) {
      if (score.hasOwnProperty(key)) {
        total += score[key];
      }
    }
    return total;
  };
  const total_result = getTotal();
  const actionColumns = [
    {
      title: String("ระดับความพึงพอใจ (Satisfaction Level)").toUpperCase(),
      dataIndex: "score",
      key: "score",
      render: (_, record) => (
        <Radio.Group onChange={(e) => handleScoreChange(record, e)}>
          <Radio
            className="text-[16px]"
            checked={score[record.key] === record.key}
            value={1}
          >
            1
          </Radio>
          <Radio
            className="text-[16px]"
            checked={score[record.key] === record.key}
            value={2}
          >
            2
          </Radio>
          <Radio
            className="text-[16px]"
            checked={score[record.key] === record.key}
            value={3}
          >
            3
          </Radio>
          <Radio
            className="text-[16px]"
            checked={score[record.key] === record.key}
            value={4}
          >
            4
          </Radio>
          <Radio
            className="text-[18px]"
            checked={score[record.key] === record.key}
            value={5}
          >
            5
          </Radio>
        </Radio.Group>
      ),
    },
  ];
  return (
    <>
      <div className="site-card-wrapper kanit">
        <Row gutter={24}>
          <Col span={24}>
            <Card
              title={
                <h1 className="text-lg text-center font-bold">{companyName}</h1>
              }
              bordered={false}
            >
              <Form form={form}>
                <p className="text-[16px]">
                  การประเมินการปฏิบัติงานผู้ส่งมอบด้านการให้บริการและการขนส่งวัตถุดิบ
                </p>
                <br />
                <div className="float-left">
                  <p className="text-[16px]">ชื่อผู้ส่งมอบ</p>
                </div>
                <div className="float-right">
                  <Form.Item
                    label="จัดซื้อ"
                    name={"จัดซื้อ"}
                    rules={[
                      {
                        required: true,
                        message: "Please select a Vendors",
                      },
                      // Add more rules as needed
                    ]}
                  >
                    <Select
                      placeholder={"เลือกรายชื่อ Vendors ที่ต้องการ"}
                      value={evaluate_vendors.temp_state_filter.vendor} // Set the value of the Select component
                      onChange={selectVendor}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      {evaluate_vendors?.vendor_list.map((item) => (
                        <Option key={item.Vendor} value={item.Vendor}>
                          {item.Vendor}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className="clear-both">
                  <div className="float-left">
                    <p className="text-[16px]">รายงานประจำเดือน</p>
                  </div>
                  <div className="float-right">
                    <Form.Item
                      label="เดือน"
                      name={"เดือน"}
                      rules={[
                        {
                          required: true,
                          message: "Please select a Month",
                        },
                        // Add more rules as needed
                      ]}
                    >
                      <Select
                        className="w-full"
                        defaultValue={"Select month"}
                        onChange={(e) => setSelectMonth(e)}
                      >
                        <Option value="JAN">JAN</Option>
                        <Option value="FEB">FEB</Option>
                        <Option value="MAR">MAR</Option>
                        <Option value="APR">APRIL</Option>
                        <Option value="MAY">MAY</Option>
                        <Option value="JUN">JUN</Option>
                        <Option value="JUL">JUL</Option>
                        <Option value="AUG">AUG</Option>
                        <Option value="SEP">SEP</Option>
                        <Option value="OCT">OCT</Option>
                        <Option value="NOV">NOV</Option>
                        <Option value="DEC">DEC</Option>
                      </Select>
                    </Form.Item>
                  </div>
                </div>
                <div className="clear-both">
                  <Table
                    className="custom-table"
                    dataSource={evaluate_vendors?.evaluate_form}
                    pagination={false}
                    columns={schema(evaluate_vendors?.evaluate_form).concat(
                      actionColumns
                    )}
                  />
                  <div>
                    <br />
                    {total_result !== 0 ? (
                      <>
                        <p className="text-[16px]">รวมทั้งหมดที่ได้</p>
                        <p className="clear-both font-bold text-[#006155] text-[18px] underline">
                          {total_result} คะแนน (%)
                        </p>
                      </>
                    ) : (
                      ""
                    )}

                    <br />
                    <p className="text-[16px]">ข้อเสนอแนะ</p>
                    <br />
                    <TextArea
                      placeholder="ระบุข้อเสนอแนะ"
                      autoSize={{ minRows: 6, maxRows: 24 }}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <br />
                    <div className="my-10">
                      <div class="overflow-x-auto">
                        <table class="sm:w-auto md:w-full border-collapse">
                          <tbody>
                            <tr class="bg-[#006254]">
                              <td class="px-4 py-2" colspan="3">
                                <h1 class="text-center font-bold text-lg text-white">
                                  เกณฑ์การให้คะแนน
                                </h1>
                              </td>
                            </tr>
                            <tr>
                              <td class="px-4 py-2 sm:w-1/3">
                                <center>เกรด</center>
                              </td>
                              <td class="px-4 py-2 sm:w-1/4">
                                <center>คะแนน (%)</center>
                              </td>
                              <td class="px-4 py-2 sm:w-2/5">
                                <center>ผลสรุป</center>
                              </td>
                            </tr>
                            <tr>
                              <td class="px-4 py-2">
                                <center>A</center>
                              </td>
                              <td class="px-4 py-2">
                                <center>90-100</center>
                              </td>
                              <td class="px-4 py-2">
                                <center>ดีมาก</center>
                              </td>
                            </tr>
                            <tr>
                              <td class="px-4 py-2">
                                <center>B</center>
                              </td>
                              <td class="px-4 py-2">
                                <center>80-89</center>
                              </td>
                              <td class="px-4 py-2">
                                <center>ดี</center>
                              </td>
                            </tr>
                            <tr>
                              <td class="px-4 py-2">
                                <center>C</center>
                              </td>
                              <td class="px-4 py-2">
                                <center>70-79</center>
                              </td>
                              <td class="px-4 py-2">
                                <center>พอใช้</center>
                              </td>
                            </tr>
                            <tr>
                              <td class="px-4 py-2">
                                <center>D</center>
                              </td>
                              <td class="px-4 py-2">
                                <center>น้อยกว่า 69</center>
                              </td>
                              <td class="px-4 py-2">
                                <center>ปรับปรุง</center>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
        <style>
          {`
            .custom-table .ant-table-cell {
              font-size: 16px;
            }
            `}
        </style>
      </div>
    </>
  );
};
export default Evaluate_form;
