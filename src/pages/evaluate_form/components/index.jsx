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
const { Option } = Select;

const Evaluate_form = () => {
  // action
  const [form] = useForm();
  const dispatch = useDispatch();
  // state
  const evaluate_vendors = useSelector((state) => state.evaluate_vendors);
  const [month, setSelectMonth] = useState("");
  const [score, setScore] = useState(0);
  const [topic, setTopic] = useState("");
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
  let id = 0;
  const evaluate_topic = evaluate_vendors?.evaluate_form.map((item) => {
    return {
      rows: (id += 1),
      หัวข้อประเมิน: item["หัวข้อประเมิน"],
    };
  });
  const handleScoreChange = (record, e) => {
    // setTopic(a["หัวข้อประเมิน"]);
    // setScore(b.target.value);
    const { rows } = record;
    const selectedValue = e.target.value;
    if (score[rows] !== selectedValue) {
      setScore({ ...score, [rows]: selectedValue });
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
  console.log("total: ", getTotal());
  const actionColumns = [
    {
      title: "score",
      dataIndex: "score",
      key: "score",
      render: (_, record) => (
        <Radio.Group onChange={(e) => handleScoreChange(record, e)}>
          <Radio checked={score[record.key] === record.key} value={1}>
            1
          </Radio>
          <Radio checked={score[record.key] === record.key} value={2}>
            2
          </Radio>
          <Radio checked={score[record.key] === record.key} value={3}>
            3
          </Radio>
          <Radio checked={score[record.key] === record.key} value={4}>
            4
          </Radio>
          <Radio checked={score[record.key] === record.key} value={5}>
            5
          </Radio>
        </Radio.Group>
      ),
    },
  ];
  console.log(typeof score);
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
              <p className="text-[16px]">
                การประเมินการปฏิบัติงานผู้ส่งมอบด้านการให้บริการและการขนส่งวัตถุดิบ
              </p>
              <p className="text-[16px]">หน่วยงาน/แผนก</p>
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
                  dataSource={evaluate_topic}
                  columns={schema(evaluate_topic).concat(actionColumns)}
                />
                {/* <List
                  itemLayout="horizontal"
                  className="text-lg"
                  dataSource={evaluate_vendors?.evaluate_form}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta description={item.topic} />
                      <List.Item
                        actions={[
                          <a key="list-loadmore-edit">edit</a>,
                        ]}
                      ></List.Item>
                    </List.Item>
                  )}
                /> */}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default Evaluate_form;
