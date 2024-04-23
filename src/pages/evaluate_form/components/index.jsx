import { Button, DatePicker, Form, Input, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useMemo, useState } from "react";
import {
  setSelect_VendorList,
  setVendorList,
} from "../actions/evaluate_formSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
const { Option } = Select;

const Evaluate_form = () => {
  // action
  const [form] = useForm();
  const dispatch = useDispatch();
  // state
  const evaluate_vendors = useSelector((state) => state.evaluate_vendors);
  const [vendorList, setVendor] = useState([]);
  const [selectMonth, setSelectMonth] = useState("");
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
  useMemo(() => {
    fetchDropdownVendor();
  }, []);
  const selectVendor = async (val) => {
    dispatch(setSelect_VendorList(val));
  };
  const { vendor } = evaluate_vendors.temp_state_filter;
  const submitEvaluate = async (val) => {
    console.log(vendor);
    console.log(selectMonth);
  };
  return (
    <>
      <div>
        <div className="container p-5">
          <h1 className=" mb-5 text-uppcase" />
          <div className="row">
            <div className="col-sm-12 bg-light rounded py-12 pt-0">
              <Form onFinish={submitEvaluate} form={form}>
                <div className="form-group">
                  <table className="w-full h-[188px]" border={0}>
                    <tbody>
                      <tr style={{ height: 24 }}>
                        <td
                          // style={{
                          //   width: "65.689%",
                          //   textAlign: "center",
                          //   height: 24,
                          // }}
                          className="text-center text-2xl font-bold pb-5"
                          colSpan={2}
                        >
                          PANASONIC ENERGY (THAILAND) CO.,LTD
                        </td>
                      </tr>
                      <tr style={{ height: 31 }}>
                        <td className="w-full" colSpan={2}>
                          การประเมินการปฏิบัติงานผู้ส่งมอบด้านการให้บริการและการขนส่งวัตถุดิบ
                        </td>
                      </tr>
                      <tr>
                        <td className="w-full">
                          <p>&nbsp;หน่วยงาน/แผนก</p>
                        </td>
                        <td className="w-full">
                          {/* &nbsp;จัดซื้อ
                          <input
                            id="fixdepartname"
                            name="fixdepartname"
                            type="hidden"
                            defaultValue="PURCHASE"
                            placeholder="Department Name"
                          /> */}
                        </td>
                      </tr>
                      <tr className="h-[35px]">
                        <td className="h-[53px]">
                          <p>&nbsp;ชื่อผู้ส่งมอบ</p>
                        </td>
                        <td className="h-[53px]">
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
                        </td>
                      </tr>
                      <tr className="h-[41px]">
                        <td className="h-[13px]">
                          <p>&nbsp;</p>
                          <p>&nbsp;รายงานประจำเดือน</p>
                        </td>
                        <td className="h-[13px]">
                          &nbsp;
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
                        </td>
                      </tr>
                      <tr className="h-[18px]">
                        <td className="h-[18px]" colSpan={2}>
                          <table
                            className="w-full min-h-[352px] max-h-screen"
                            border={0}
                          >
                            <tbody>
                              <tr style={{ height: 18 }}>
                                <td style={{ width: "57.9023%", height: 10 }}>
                                  &nbsp;
                                </td>
                                <td
                                  style={{ width: "42.0979%", height: 10 }}
                                  colSpan={5}
                                >
                                  <strong>
                                    <span style={{ fontSize: 18 }}>
                                      ระดับความพึงพอใจ (Satisfaction Level)
                                    </span>
                                  </strong>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  &nbsp;
                                  <strong>
                                    <span style={{ fontSize: 20 }}>
                                      หัวข้อประเมิน
                                    </span>
                                  </strong>
                                </td>
                                <td align="center">1</td>
                                <td align="center">2</td>
                                <td align="center">3</td>
                                <td align="center">4</td>
                                <td align="center">5</td>
                              </tr>
                              <tr>
                                <td colSpan={6}>
                                  <br />
                                  <span className="text-[18px] font-bold">
                                    คุณภาพการบรรจุหีบห่อ
                                  </span>
                                  <br />
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  &nbsp;
                                  <span className="text-[16px]">
                                    1.การส่งมอบสินค้าตรงเวลา
                                    <input
                                      name="Q11"
                                      type="hidden"
                                      defaultValue="1.การส่งมอบสินค้าตรงเวลา"
                                    />
                                  </span>
                                </td>
                                <td style={{ width: "9.26738%", height: 27 }}>
                                  <center>
                                    <input
                                      name="ws11"
                                      type="radio"
                                      defaultValue={1}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.05994%", height: 27 }}>
                                  <center>
                                    <input
                                      name="ws11"
                                      type="radio"
                                      defaultValue={2}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "8.15959%", height: 27 }}>
                                  <center>
                                    <input
                                      name="ws11"
                                      type="radio"
                                      defaultValue={3}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.70994%", height: 27 }}>
                                  <center>
                                    <input
                                      name="ws11"
                                      type="radio"
                                      defaultValue={4}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "9.90104%", height: 27 }}>
                                  <center>
                                    <input
                                      name="ws11"
                                      type="radio"
                                      defaultValue={5}
                                    />
                                  </center>
                                </td>
                              </tr>
                              <tr style={{ height: 36 }}>
                                <td style={{ width: "57.9023%", height: 36 }}>
                                  &nbsp;
                                  <span className="text-[16px]">
                                    2.การแต่งกายของเจ้าหน้าที่จัดส่งและ
                                    ความสุภาพ การปฏิบัติตนขณะขนส่ง
                                  </span>
                                  <input
                                    name="Q21"
                                    type="hidden"
                                    defaultValue="2.การแต่งกายของเจ้าหน้าที่จัดส่งและ ความสุภาพ การปฏิบัติตนขณะขนส่ง"
                                  />
                                </td>
                                <td style={{ width: "9.26738%", height: 36 }}>
                                  <center>
                                    <input
                                      name="ws21"
                                      type="radio"
                                      defaultValue={1}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.05994%", height: 36 }}>
                                  <center>
                                    <input
                                      name="ws21"
                                      type="radio"
                                      defaultValue={2}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "8.15959%", height: 36 }}>
                                  <center>
                                    <input
                                      name="ws21"
                                      type="radio"
                                      defaultValue={3}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.70994%", height: 36 }}>
                                  <center>
                                    <input
                                      name="ws21"
                                      type="radio"
                                      defaultValue={4}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "9.90104%", height: 36 }}>
                                  <center>
                                    <input
                                      name="ws21"
                                      type="radio"
                                      defaultValue={5}
                                    />
                                  </center>
                                </td>
                              </tr>
                              <tr style={{ height: 54 }}>
                                <td style={{ width: "57.9023%", height: 54 }}>
                                  &nbsp;
                                  <span className="text-[16px]">
                                    3.ชนิดสินค้าและจำนวนถูกต้อง
                                    มีการจัดเรียงสินค้าเป็นระเบียบเรียบร้อยเมื่อส่งมอบงาน
                                  </span>
                                  <input
                                    name="Q31"
                                    type="hidden"
                                    defaultValue="3.ชนิดสินค้าและจำนวนถูกต้อง มีการจัดเรียงสินค้าเป็นระเบียบเรียบร้อยเมื่อส่งมอบงาน"
                                  />
                                </td>
                                <td style={{ width: "9.26738%", height: 54 }}>
                                  <center>
                                    <input
                                      name="ws31"
                                      type="radio"
                                      defaultValue={1}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.05994%", height: 54 }}>
                                  <center>
                                    <input
                                      name="ws31"
                                      type="radio"
                                      defaultValue={2}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "8.15959%", height: 54 }}>
                                  <center>
                                    <input
                                      name="ws31"
                                      type="radio"
                                      defaultValue={3}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.70994%", height: 54 }}>
                                  <center>
                                    <input
                                      name="ws31"
                                      type="radio"
                                      defaultValue={4}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "9.90104%", height: 54 }}>
                                  <center>
                                    <input
                                      name="ws31"
                                      type="radio"
                                      defaultValue={5}
                                    />
                                  </center>
                                </td>
                              </tr>
                              <tr style={{ height: 54 }}>
                                <td style={{ width: "57.9023%", height: 54 }}>
                                  &nbsp;
                                  <span className="text-[16px]">
                                    4.เจ้าหน้าที่จัดส่ง
                                    ปฏิบัติตามกฏระบียบของบริษัทอย่างเคร่งครัด
                                  </span>
                                  <input
                                    name="Q41"
                                    type="hidden"
                                    defaultValue="4.เจ้าหน้าที่จัดส่ง ปฏิบัติตามกฏระบียบของบริษัทอย่างเคร่งครัด"
                                  />
                                </td>
                                <td style={{ width: "9.26738%", height: 54 }}>
                                  <center>
                                    <input
                                      name="ws41"
                                      type="radio"
                                      defaultValue={1}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.05994%", height: 54 }}>
                                  <center>
                                    <input
                                      name="ws41"
                                      type="radio"
                                      defaultValue={2}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "8.15959%", height: 54 }}>
                                  <center>
                                    <input
                                      name="ws41"
                                      type="radio"
                                      defaultValue={3}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.70994%", height: 54 }}>
                                  <center>
                                    <input
                                      name="ws41"
                                      type="radio"
                                      defaultValue={4}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "9.90104%", height: 54 }}>
                                  <center>
                                    <input
                                      name="ws41"
                                      type="radio"
                                      defaultValue={5}
                                    />
                                  </center>
                                </td>
                              </tr>
                              <tr style={{ height: 72 }}>
                                <td style={{ width: "57.9023%", height: 72 }}>
                                  &nbsp;
                                  <span className="text-[16px]">
                                    5.ลักษณะทางกายภาพของหีบห่อที่บรรจุสินค้า
                                    (เช่น ไม่มีรอยฉีกขาด เป็นต้น)
                                  </span>
                                  <input
                                    name="Q51"
                                    type="hidden"
                                    defaultValue="5.ลักษณะทางกายภาพของหีบห่อที่บรรจุสินค้า (เช่น ไม่มีรอยฉีกขาด เป็นต้น)"
                                  />
                                </td>
                                <td style={{ width: "9.26738%", height: 72 }}>
                                  <center>
                                    <input
                                      name="ws51"
                                      type="radio"
                                      defaultValue={1}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.05994%", height: 72 }}>
                                  <center>
                                    <input
                                      name="ws51"
                                      type="radio"
                                      defaultValue={2}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "8.15959%", height: 72 }}>
                                  <center>
                                    <input
                                      name="ws51"
                                      type="radio"
                                      defaultValue={3}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.70994%", height: 72 }}>
                                  <center>
                                    <input
                                      name="ws51"
                                      type="radio"
                                      defaultValue={4}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "9.90104%", height: 72 }}>
                                  <center>
                                    <input
                                      name="ws51"
                                      type="radio"
                                      defaultValue={5}
                                    />
                                  </center>
                                </td>
                              </tr>
                              <tr style={{ height: 18 }}>
                                <td style={{ width: "57.9023%", height: 24 }}>
                                  &nbsp;
                                  <span className="text-[16px]">
                                    6.ป้ายชื่อสินค้าถูกต้องตามมาตรฐาน,
                                    บรรจุหีบห่อถูกต้องตามข้อกำหนด
                                  </span>
                                  <input
                                    name="Q61"
                                    type="hidden"
                                    defaultValue="6.ป้ายชื่อสินค้าถูกต้องตามมาตรฐาน, บรรจุหีบห่อถูกต้องตามข้อกำหนด"
                                  />
                                </td>
                                <td style={{ width: "9.26738%", height: 24 }}>
                                  <center>
                                    <input
                                      name="ws61"
                                      type="radio"
                                      defaultValue={1}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.05994%", height: 24 }}>
                                  <center>
                                    <input
                                      name="ws61"
                                      type="radio"
                                      defaultValue={2}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "8.15959%", height: 24 }}>
                                  <center>
                                    <input
                                      name="ws61"
                                      type="radio"
                                      defaultValue={3}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.70994%", height: 24 }}>
                                  <center>
                                    <input
                                      name="ws61"
                                      type="radio"
                                      defaultValue={4}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "9.90104%", height: 24 }}>
                                  <center>
                                    <input
                                      name="ws61"
                                      type="radio"
                                      defaultValue={5}
                                    />
                                  </center>
                                </td>
                              </tr>
                              <tr style={{ height: 18 }}>
                                <td
                                  style={{ width: "57.9023%", height: 18 }}
                                  colSpan={6}
                                >
                                  <br />
                                  <span className="text-[18px]">
                                    <strong>Service / การบริการ</strong>
                                  </span>
                                </td>
                              </tr>
                              <tr style={{ height: 18 }}>
                                <td style={{ width: "57.9023%", height: 18 }}>
                                  <span className="text-[16px]">
                                    &nbsp;1.ความรวดเร็วในการแก้ปัญหา
                                  </span>
                                  <input
                                    name="QS11"
                                    type="hidden"
                                    defaultValue="1.ความรวดเร็วในการแก้ปัญหา"
                                  />
                                </td>
                                <td style={{ width: "9.26738%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws11"
                                      type="radio"
                                      defaultValue={1}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.05994%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws11"
                                      type="radio"
                                      defaultValue={2}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "8.15959%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws11"
                                      type="radio"
                                      defaultValue={3}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.70994%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws11"
                                      type="radio"
                                      defaultValue={4}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "9.90104%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws11"
                                      type="radio"
                                      defaultValue={5}
                                    />
                                  </center>
                                </td>
                              </tr>
                              <tr style={{ height: 25 }}>
                                <td style={{ width: "57.9023%", height: 25 }}>
                                  <span className="text-[16px]">
                                    &nbsp;2.ความสุภาพและการปฏิบัติของพนักงานบริษัท
                                  </span>
                                  <input
                                    name="QS21"
                                    type="hidden"
                                    defaultValue="2.ความสุภาพและการปฏิบัติของพนักงานบริษัท"
                                  />
                                </td>
                                <td style={{ width: "9.26738%", height: 25 }}>
                                  <center>
                                    <input
                                      name="qws21"
                                      type="radio"
                                      defaultValue={1}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.05994%", height: 25 }}>
                                  <center>
                                    <input
                                      name="qws21"
                                      type="radio"
                                      defaultValue={2}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "8.15959%", height: 25 }}>
                                  <center>
                                    <input
                                      name="qws21"
                                      type="radio"
                                      defaultValue={3}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.70994%", height: 25 }}>
                                  <center>
                                    <input
                                      name="qws21"
                                      type="radio"
                                      defaultValue={4}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "9.90104%", height: 25 }}>
                                  <center>
                                    <input
                                      name="qws21"
                                      type="radio"
                                      defaultValue={5}
                                    />
                                  </center>
                                </td>
                              </tr>
                              <tr style={{ height: 31 }}>
                                <td
                                  style={{ width: "57.9023%", height: 31 }}
                                  colSpan={6}
                                >
                                  <span className="text-[18px]">
                                    <br />
                                    <strong>
                                      Marketing Co-ordination /
                                      การติดต่อประสานงาน
                                    </strong>
                                  </span>
                                </td>
                              </tr>
                              <tr style={{ height: 19 }}>
                                <td className="text-[16px]">
                                  &nbsp;1.การเป็นที่ปรึกษา
                                  ให้คำแนะนำด้านเทคนิคผลิตภัณฑ์
                                  <input
                                    name="QM31"
                                    type="hidden"
                                    defaultValue="1.การเป็นที่ปรึกษา ให้คำแนะนำด้านเทคนิคผลิตภัณฑ์"
                                  />
                                </td>
                                <td style={{ width: "9.26738%", height: 19 }}>
                                  <center>
                                    <input
                                      name="qws31"
                                      type="radio"
                                      defaultValue={1}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.05994%", height: 19 }}>
                                  <center>
                                    <input
                                      name="qws31"
                                      type="radio"
                                      defaultValue={2}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "8.15959%", height: 19 }}>
                                  <center>
                                    <input
                                      name="qws31"
                                      type="radio"
                                      defaultValue={3}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.70994%", height: 19 }}>
                                  <center>
                                    <input
                                      name="qws31"
                                      type="radio"
                                      defaultValue={4}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "9.90104%", height: 19 }}>
                                  <center>
                                    <input
                                      name="qws31"
                                      type="radio"
                                      defaultValue={5}
                                    />
                                  </center>
                                </td>
                              </tr>
                              <tr style={{ height: 18 }}>
                                <td className="text-[16px]">
                                  &nbsp;2.ความสุภาพและการปฏิบัติของพนักงานขาย
                                  <input
                                    name="QM32"
                                    type="hidden"
                                    defaultValue="2.ความสุภาพและการปฏิบัติของพนักงานขาย"
                                  />
                                </td>
                                <td style={{ width: "9.26738%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws32"
                                      type="radio"
                                      defaultValue={1}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.05994%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws32"
                                      type="radio"
                                      defaultValue={2}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "8.15959%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws32"
                                      type="radio"
                                      defaultValue={3}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.70994%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws32"
                                      type="radio"
                                      defaultValue={4}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "9.90104%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws32"
                                      type="radio"
                                      defaultValue={5}
                                    />
                                  </center>
                                </td>
                              </tr>
                              <tr style={{ height: 18 }}>
                                <td className="text-[16px]">
                                  &nbsp;3.ความสม่ำเสมอในการติดต่อและบริการ
                                  <input
                                    name="QM33"
                                    type="hidden"
                                    defaultValue="3.ความสม่ำเสมอในการติดต่อและบริการ"
                                  />
                                </td>
                                <td style={{ width: "9.26738%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws33"
                                      type="radio"
                                      defaultValue={1}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.05994%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws33"
                                      type="radio"
                                      defaultValue={2}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "8.15959%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws33"
                                      type="radio"
                                      defaultValue={3}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.70994%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws33"
                                      type="radio"
                                      defaultValue={4}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "9.90104%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws33"
                                      type="radio"
                                      defaultValue={5}
                                    />
                                  </center>
                                </td>
                              </tr>
                              <tr style={{ height: 18 }}>
                                <td
                                  style={{ width: "57.9023%", height: 18 }}
                                  colSpan={6}
                                >
                                  &nbsp;
                                  <span className="text-[16px]">
                                    เอกสารต่าง ๆ ที่เกี่ยวข้อง{" "}
                                  </span>
                                </td>
                              </tr>
                              <tr style={{ height: 18 }}>
                                <td className="text-[16px]">
                                  &nbsp;1.Certificate of Analysis [COA] (เช่น
                                  ความถูกต้อง ความครบถ้วน การตรงต่อเวลา เป็นต้น)
                                  <input
                                    name="QM41"
                                    type="hidden"
                                    defaultValue="1.Certificate of Analysis [COA] (เช่น ความถูกต้อง ความครบถ้วน การตรงต่อเวลา เป็นต้น)"
                                  />
                                </td>
                                <td style={{ width: "9.26738%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws41"
                                      type="radio"
                                      defaultValue={1}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.05994%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws41"
                                      type="radio"
                                      defaultValue={2}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "8.15959%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws41"
                                      type="radio"
                                      defaultValue={3}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.70994%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws41"
                                      type="radio"
                                      defaultValue={4}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "9.90104%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws41"
                                      type="radio"
                                      defaultValue={5}
                                    />
                                  </center>
                                </td>
                              </tr>
                              <tr style={{ height: 18 }}>
                                <td className="text-[16px]">
                                  &nbsp;2.Quotation (ใบเสนอราคา) (เช่น
                                  ความรวดเร็ว ความถูกต้อง ความครบถ้วน เป็นต้น)
                                  <input
                                    name="QM42"
                                    type="hidden"
                                    defaultValue="2.Quotation (ใบเสนอราคา) (เช่น ความรวดเร็ว ความถูกต้อง ความครบถ้วน เป็นต้น)"
                                  />
                                </td>
                                <td style={{ width: "9.26738%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws42"
                                      type="radio"
                                      defaultValue={1}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.05994%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws42"
                                      type="radio"
                                      defaultValue={2}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "8.15959%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws42"
                                      type="radio"
                                      defaultValue={3}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.70994%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws42"
                                      type="radio"
                                      defaultValue={4}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "9.90104%", height: 18 }}>
                                  <center>
                                    <input
                                      name="qws42"
                                      type="radio"
                                      defaultValue={5}
                                    />
                                  </center>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-[16px]">
                                  &nbsp;3.Invoice / เอกสารส่งมอบงาน (เช่น
                                  ความถูกต้อง ความครบถ้วน การตรงต่อเวลา เป็นต้น)
                                  <input
                                    name="QM43"
                                    type="hidden"
                                    defaultValue="3.Invoice / เอกสารส่งมอบงาน (เช่น ความถูกต้อง ความครบถ้วน การตรงต่อเวลา เป็นต้น)"
                                  />
                                </td>
                                <td style={{ width: "9.26738%" }}>
                                  <center>
                                    <input
                                      name="qws43"
                                      type="radio"
                                      defaultValue={1}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.05994%" }}>
                                  <center>
                                    <input
                                      name="qws43"
                                      type="radio"
                                      defaultValue={2}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "8.15959%" }}>
                                  <center>
                                    <input
                                      name="qws43"
                                      type="radio"
                                      defaultValue={3}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "7.70994%" }}>
                                  <center>
                                    <input
                                      name="qws43"
                                      type="radio"
                                      defaultValue={4}
                                    />
                                  </center>
                                </td>
                                <td style={{ width: "9.90104%" }}>
                                  <center>
                                    <input
                                      name="qws43"
                                      type="radio"
                                      defaultValue={5}
                                    />
                                  </center>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ width: "57.9023%" }}>
                                  ข้อเสนอแนะ
                                </td>
                                <td style={{ width: "42.0979%" }} colSpan={5}>
                                  &nbsp;
                                  <textarea
                                    id="wreview"
                                    cols={50}
                                    name="wreview"
                                    rows={4}
                                    defaultValue={""}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <table
                            style={{ width: "100%", height: 185 }}
                            border={0}
                          >
                            <tbody>
                              <tr style={{ height: 34 }}>
                                <td
                                  style={{ width: "100%", height: 34 }}
                                  colSpan={3}
                                >
                                  <center>เกณฑ์การให้คะแนน</center>
                                </td>
                              </tr>
                              <tr style={{ height: 41 }}>
                                <td style={{ width: "38.5835%", height: 41 }}>
                                  <center>เกรด</center>
                                </td>
                                <td style={{ width: "22.1459%", height: 41 }}>
                                  <center>คะแนน (%)</center>
                                </td>
                                <td style={{ width: "39.2706%", height: 41 }}>
                                  <center>ผลสรุป</center>
                                </td>
                              </tr>
                              <tr style={{ height: 38 }}>
                                <td
                                  style={{ width: "38.5835%", height: 33 }}
                                  align="center"
                                >
                                  A
                                </td>
                                <td
                                  style={{ width: "22.1459%", height: 33 }}
                                  align="center"
                                >
                                  90-100
                                </td>
                                <td
                                  style={{ width: "39.2706%", height: 33 }}
                                  align="center"
                                >
                                  ดีมาก
                                </td>
                              </tr>
                              <tr style={{ height: 25 }}>
                                <td
                                  style={{ width: "38.5835%", height: 25 }}
                                  align="center"
                                >
                                  B
                                </td>
                                <td
                                  style={{ width: "22.1459%", height: 25 }}
                                  align="center"
                                >
                                  80-89
                                </td>
                                <td
                                  style={{ width: "39.2706%", height: 25 }}
                                  align="center"
                                >
                                  ดี
                                </td>
                              </tr>
                              <tr style={{ height: 24 }}>
                                <td
                                  style={{ width: "38.5835%", height: 24 }}
                                  align="center"
                                >
                                  C
                                </td>
                                <td
                                  style={{ width: "22.1459%", height: 24 }}
                                  align="center"
                                >
                                  70-79
                                </td>
                                <td
                                  style={{ width: "39.2706%", height: 24 }}
                                  align="center"
                                >
                                  พอใช้
                                </td>
                              </tr>
                              <tr style={{ height: 28 }}>
                                <td
                                  style={{ width: "38.5835%", height: 28 }}
                                  align="center"
                                >
                                  D
                                </td>
                                <td
                                  style={{ width: "22.1459%", height: 28 }}
                                  align="center"
                                >
                                  น้อยกว่า 69
                                </td>
                                <td
                                  style={{ width: "39.2706%", height: 28 }}
                                  align="center"
                                >
                                  ปรับปรุง
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr />
                    </tbody>
                  </table>
                </div>
                <br />
                <div className="table m-auto mt-10 mb-10">
                  <Button
                    style={{
                      backgroundColor: "#006254",
                      color: "white",
                    }}
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
                      ประเมิน
                    </div>
                  </Button>
                </div>
              </Form>
              {/* <table
                id="dataTable"
                style={{ width: "100%", height: 102 }}
                border={0}
              >
                <tbody>
                  <tr style={{ height: 34 }}>
                    <td style={{ width: "100%", height: 34 }} colSpan={5}>
                      <center>แสดงผลรวมทั้งหมดของการประเมิน Vendor</center>
                    </td>
                  </tr>
                  <tr style={{ height: 41 }}>
                    <td style={{ width: "27.3784%", height: 41 }}>
                      <center>ชื่อ</center>
                    </td>
                    <td style={{ width: "29.5455%", height: 41 }}>
                      <center>รายงานประจำเดือน</center>
                    </td>
                    <td style={{ width: "23.4408%" }}>
                      <center>วันที่สร้าง</center>
                    </td>
                    <td style={{ width: "9.81765%" }}>
                      <center>%</center>
                    </td>
                    <td style={{ width: "9.81765%", height: 41 }}>
                      <center>เกรด</center>
                    </td>
                  </tr>
                  <tr style={{ height: 38 }}>
                    <td
                      style={{ width: "27.3784%", height: 27 }}
                      align="center"
                    >
                      &nbsp;
                    </td>
                    <td
                      style={{ width: "29.5455%", height: 27 }}
                      align="center"
                    >
                      &nbsp;
                    </td>
                    <td style={{ width: "23.4408%" }}>&nbsp;</td>
                    <td style={{ width: "9.81765%" }}>&nbsp;</td>
                    <td
                      style={{ width: "9.81765%", height: 27 }}
                      align="center"
                    >
                      &nbsp;
                    </td>
                  </tr>
                </tbody>
              </table> */}
            </div>
          </div>
        </div>
        <style>
          {`
            div {
              font-family: 'Kanit', 'sans-serif'
            }
            `}
        </style>
      </div>
    </>
  );
};
export default Evaluate_form;
