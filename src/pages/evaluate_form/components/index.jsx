import { Button, Card, Col, Form, Radio, Row, Select, Table } from "antd";
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
import TextArea from "antd/es/input/TextArea";
import GradingTable from "../../../components/grading/components/grading";
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
  // action of scoring
  let id = 0;
  const actionColumns = [
    {
      title: String("ระดับความพึงพอใจ (Satisfaction Level)").toUpperCase(),
      dataIndex: "score",
      key: "score",
      render: (_, record) => (
        <Form.Item name={`score_${(id += 1)}`}>
          <Radio.Group onChange={(e) => handleScoreChange(record, e)}>
            <Radio
              className="text-[16px]"
              checked={score[record.key] === 1}
              value={1}
            >
              1
            </Radio>
            <Radio
              className="text-[16px]"
              checked={score[record.key] === 2}
              value={2}
            >
              2
            </Radio>
            <Radio
              className="text-[16px]"
              checked={score[record.key] === 3}
              value={3}
            >
              3
            </Radio>
            <Radio
              className="text-[16px]"
              checked={score[record.key] === 4}
              value={4}
            >
              4
            </Radio>
            <Radio
              className="text-[18px]"
              checked={score[record.key] === 5}
              value={5}
            >
              5
            </Radio>
          </Radio.Group>
        </Form.Item>
      ),
    },
  ];
  const submitForm = async (val) => {
    form.resetFields();
    let payload = {
      supplier: vendor,
      evaluate_date: month,
      evaluate_scoreTotal: getTotal(),
      comments: comments,
    };
    const response = await axios.post("/api/evaluate/sending_form", payload);
  };
  return (
    <>
      <div className="site-card-wrapper kanit">
        <Row>
          <Col span={24}>
            <Card
              title={
                <h1 className="text-2xl text-center font-bold pl-0 p-3 mb-10">
                  {companyName}
                </h1>
              }
              bordered={false}
            >
              <Form onFinish={submitForm} form={form}>
                <p className="text-[16px]">
                  การประเมินการปฏิบัติงานผู้ส่งมอบด้านการให้บริการและการขนส่งวัตถุดิบ
                </p>
                <br />
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-[16px] float-left">
                    ชื่อผู้ส่งมอบ (Supplier)
                  </p>
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
                      placeholder={"เลือกรายชื่อ Vendors ที่ต้องการ"}
                      value={evaluate_vendors.temp_state_filter.vendor} // Set the value of the Select component
                      onChange={selectVendor}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      {evaluate_vendors?.vendor_list.map((item) => (
                        <Option value={item.Vendor}>{item.Vendor}</Option>
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
                      name={"month"}
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
                        {[
                          { name: "January", number: 1 },
                          { name: "February", number: 2 },
                          { name: "March", number: 3 },
                          { name: "April", number: 4 },
                          { name: "May", number: 5 },
                          { name: "June", number: 6 },
                          { name: "July", number: 7 },
                          { name: "August", number: 8 },
                          { name: "September", number: 9 },
                          { name: "October", number: 10 },
                          { name: "November", number: 11 },
                          { name: "December", number: 12 },
                        ].map((item) => (
                          <Option key={item.number} value={item.name}>
                            {item.name}
                          </Option>
                        ))}
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
                    <p className="text-[16px]">ข้อเสนอแนะ</p>
                    <br />
                    <Form.Item name={"comments"}>
                      <TextArea
                        placeholder="ระบุข้อเสนอแนะ"
                        autoSize={{ minRows: 6, maxRows: 24 }}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </Form.Item>
                    <div className="table m-auto mt-5">
                      <Button
                        disabled={
                          vendor != "" && month != "" && score != 0
                            ? false
                            : true
                        }
                        htmlType="submit"
                        className="uppercase ml-2"
                      >
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
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                          submit form
                        </div>
                      </Button>
                    </div>
                    <br />
                    <GradingTable />
                  </div>
                  <br />
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
