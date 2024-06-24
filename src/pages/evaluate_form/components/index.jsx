import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Space,
  Table,
  Tabs,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import Group_topic_evaluate_update from "../../../components/evaluateform/group_topic_evaluate_update";
import Group_topic_approve from "../../../components/evaluateform/group_topic_approve";
// Components
import Supplier_Eva from "../../../components/evaluateform/select_supplier_list/index";
import ReportMonth from "../../../components/evaluateform/select_report_month";
import GroupTopic from "../../../components/evaluateform/group_topic";
import GradingTable from "../../../components/grading/components/grading";

// Actions
import {
  setEvaluateConfirm,
  setEvaluatePending,
  setEvaluateResultTable,
  setForm,
  setVendorList,
} from "../actions/evaluate_formSlice";

// Helpers
import schema from "../../../javascript/print_schema";
import convert_year_th from "../../../javascript/convert_year_th";
import generatePDF from "../../../javascript/generate_pdf/evaluation_pdf/generate_pdf";
import { CloseCircleOutlined, FilePdfOutlined } from "@ant-design/icons";

const dateFormat = "DD/MM/YYYY";

const Evaluate = (props) => {
  const [supplierName, setSupplierName] = useState("");
  const [save_draft] = useForm();
  const [draft_form] = useForm();
  const [approve_form] = useForm();
  const dispatch = useDispatch();
  const comments = useRef("");
  const updateComment = useRef("");
  const approveComment = useRef("");
  const evaluate_vendors = useSelector((state) => state.evaluate_vendors);

  const [activeTabView, setActiveTabView] = useState("1");
  const [pageSize, setPageSize] = useState(5);
  const [month, setSelectMonth] = useState("");
  const [score, setScore] = useState([]);

  // Draft Drawer State
  const [draftDrawerOpen, setDraftDrawerOpen] = useState(false);
  const [draftData, setDraftData] = useState(null);
  const [draft_id, setDraftId] = useState("");

  // Confirm Drawer State
  const [confirmDrawerOpen, setConfirmDrawerOpen] = useState(false);
  const [confirmData, setConfirmData] = useState(null);
  const [approve_id, setApproveId] = useState("");

  useEffect(() => {
    fetchEvaluateTopic();
    fetchDropdownVendor();
    fetchEvaluate();
    fetchEvaluateDraft();
    fetchEvaluateConfirm();
  }, []);

  const fetchDropdownVendor = async () => {
    try {
      const response = await axios.get(`${props.baseUrl}/api/dropdown/vendor`, {
        headers: { Authorization: `Bearer ${props.token_id}` },
      });
      dispatch(setVendorList(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEvaluateTopic = async () => {
    try {
      const response = await axios.get(`${props.baseUrl}/api/evaluate/topic`, {
        headers: { Authorization: `Bearer ${props.token_id}` },
      });
      dispatch(setForm(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEvaluate = async () => {
    try {
      const response = await axios.get(
        `${props.baseUrl}/api/evaluate/summary_score`,
        {
          headers: { Authorization: `Bearer ${props.token_id}` },
        }
      );
      dispatch(setEvaluateResultTable(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEvaluateDraft = async () => {
    try {
      const response = await axios.get(`${props.baseUrl}/api/evaluate/draft`, {
        headers: { Authorization: `Bearer ${props.token_id}` },
      });
      dispatch(setEvaluatePending(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchEvaluateConfirm = async () => {
    try {
      const response = await axios.get(
        `${props.baseUrl}/api/evaluate/confirm`,
        {
          headers: { Authorization: `Bearer ${props.token_id}` },
        }
      );
      dispatch(setEvaluateConfirm(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleTabsView = (key) => {
    setActiveTabView(key);
  };
  //create evaluateForm
  const submitForm = async (values) => {
    try {
      const payload = {
        supplier: evaluate_vendors.temp_state_filter.vendor,
        evaluate_date: month,
        comments: comments.current.resizableTextArea.textArea.value,
        eval_form: score,
        flag_status: score.every((item) => item.EVALUATE_TOPIC_SCORE !== 0)
          ? "waiting"
          : "draft",
        full_score: score.length * 5,
      };
      const response = await axios.post(
        `${props.baseUrl}/api/evaluate/sending_form`,
        payload,
        { headers: { Authorization: `Bearer ${props.token_id}` } }
      );
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  // open form
  const openDraftDrawer = async (record) => {
    try {
      const payload = {
        eva_id: record.EVALUATE_ID,
        supplier: record.SUPPLIER,
        evaluate_date: record.EVALUATE_DATE,
        flag_status: record.FLAG_STATUS,
      };
      const response = await axios.post(
        `${props.baseUrl}/api/evaluate/update_form`,
        payload,
        { headers: { Authorization: `Bearer ${props.token_id}` } }
      );
      if (response.status === 200) {
        setDraftData(response.data);
        setSupplierName(record.SUPPLIER);
        setDraftId(record.EVALUATE_ID);
        setDraftDrawerOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openConfirmDrawer = async (record) => {
    try {
      const payload = {
        eva_id: record.EVALUATE_ID,
        supplier: record.SUPPLIER,
        evaluate_date: record.EVALUATE_DATE,
        flag_status: record.FLAG_STATUS,
      };
      const response = await axios.post(
        `${props.baseUrl}/api/evaluate/update_form`,
        payload,
        { headers: { Authorization: `Bearer ${props.token_id}` } }
      );
      if (response.status === 200) {
        setConfirmData(response.data);
        setSupplierName(record.SUPPLIER);
        setApproveId(record.EVALUATE_ID);
        setConfirmDrawerOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateDraftData = async (data, evaluate_date) => {
    try {
      //console.log(draft_id);
      const updatePayload = {
        supplier: supplierName,
        evaluate_date: evaluate_date,
        comments: comments.current.resizableTextArea.textArea.value,
        updateScore: data,
        flag_status: data.reduce((acc, curr) => {
          // Using the reduce function on the `score` array to transform it into an object.
          return curr.EVALUATE_TOPIC_SCORE != 0 ? "waiting" : "draft";
        }, {}),
        full_score: score.length * 5, // Calculating the full score based on the length of the `score` array and multiplying it by 5.
      };
      const response = await axios.put(
        `${props.baseUrl}/api/evaluate/form/update/${draft_id}`,
        updatePayload,
        { headers: { Authorization: `Bearer ${props.token_id}` } }
      );
      if (response.status === 200) {
        setDraftDrawerOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateConfirmData = async (data, approve_date) => {
    try {
      //approve_id
      const approve_payload = {
        supplier: supplierName,
        evaluate_date: approve_date,
        comments: approveComment.current.resizableTextArea.textArea.value,
        updateScore: data,
        flag_status: "confirm",
        full_score: score.length * 5, // Calculating the full score based on the length of the `score` array and multiplying it by 5.
      };
      const response = await axios.put(
        `${props.baseUrl}/api/evaluate/form/update/${approve_id}`,
        approve_payload,
        { headers: { Authorization: `Bearer ${props.token_id}` } }
      );
      if (response.status === 200) {
        setConfirmDrawerOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const savePDF = async (record) => {
    const evaluateId = record?.EVALUATE_ID;
    const supplier = record?.SUPPLIER;
    const evaluate_date = record?.EVALUATE_DATE;
    const flag_status = record?.FLAG_STATUS;
    const department = record?.DEPARTMENT;
    let pdf_payload = {
      evaluate_id: evaluateId,
      supplier: supplier,
      evaluate_date: evaluate_date,
      flag_status: flag_status,
    };
    const response = await axios.post(
      `${props.baseUrl}/api/evaluate/generate_pdf`,
      pdf_payload,
      {
        headers: {
          Authorization: `Bearer ${props.token_id}`,
        },
      }
    );
    if (response.status === 200) {
      generatePDF(supplier, evaluate_date, department, response.data);
    }
  };
  const DraftDrawer = ({ open, onClose, data }) => {
    const [SelectScore, setSelectScore] = useState([]);
    if (!data || data.length === 0) {
      // Handle case where data is not available or empty
      return "";
    }
    console.log(data)
    return (
      <Drawer
        placement="right"
        visible={open}
        extra={
          <Space>
            <CloseCircleOutlined
              onClick={onClose}
              className="text-[24px] text-left"
            />
          </Space>
        }
        width={window.innerWidth}
        footer={null}
      >
        <Form
          onFinish={updateDraftData.bind(
            this,
            SelectScore,
            moment(data[0]?.EVALUATE_DATE).format("YYYY-MM-DD")
          )}
          form={draft_form}
          //initialValues={data}
        >
          <div className="flex-row">
            <h1 className="text-2xl text-center font-bold">{supplierName}</h1>
            <br />
            <div className="float-left">
              <p className="text-[16px]">
                การประเมินการปฏิบัติงานผู้ส่งมอบด้านการให้บริการและการขนส่งวัตถุดิบ
              </p>
            </div>

            <div className="clear-both">
              <br />
              <p className="text-[18px] float-left">รายงานประจำเดือน</p>
              <Input
                className="w-[140px] float-right mb-5"
                value={moment(data[0]?.EVALUATE_DATE).format("YYYY-MM-DD")}
              />
            </div>
            <div className="clear-both">
              <Group_topic_evaluate_update
                topicGroup={data}
                SelectScore={SelectScore}
                setSelectScore={setSelectScore}
              />
            </div>
            <br />
            <Form.Item>
              <TextArea
                placeholder="ระบุข้อเสนอแนะ"
                defaultValue={data[0].EVALUATE_COMMENT}
                autoSize={{
                  minRows: 6,
                  maxRows: 24,
                }}
                ref={updateComment}
              />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" className="table m-auto uppercase">
                <div className="flex flex-row">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                  SAVE draft
                </div>
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    );
  };
  const ConfirmDrawer = ({ open, onClose, data }) => {
    const [scoreApprove, setScoreApprove] = useState([]);
    if (!data || data.length === 0) {
      // Handle case where data is not available or empty
      return "";
    }
    return (
      <Drawer
        placement="right"
        visible={open}
        width={window.innerWidth}
        extra={
          <Space>
            <CloseCircleOutlined
              onClick={onClose}
              className="text-[24px] text-left"
            />
          </Space>
        }
      >
        <Form
          onFinish={updateConfirmData.bind(
            this,
            scoreApprove,
            moment(data[0]?.EVALUATE_DATE).format("YYYY-MM-DD")
          )}
          initialValues={data}
          form={approve_form}
        >
          {/* Form fields for approving evaluation */}
          {/* <Button htmlType="submit">Approve</Button> */}
          <div className="flex-row">
            <h1 className="text-2xl text-center font-bold">{supplierName}</h1>
            <br />
            <div className="float-left">
              <p className="text-[16px]">
                การประเมินการปฏิบัติงานผู้ส่งมอบด้านการให้บริการและการขนส่งวัตถุดิบ
              </p>
            </div>

            <div className="clear-both">
              <br />
              <p className="text-[18px] float-left">รายงานประจำเดือน</p>
              <Input
                className="w-[140px] float-right mb-5"
                value={moment(data[0]?.EVALUATE_DATE).format("YYYY-MM-DD")}
              />
            </div>
            <div className="clear-both">
              <Group_topic_approve
                topicGroup={data}
                setScoreApprove={setScoreApprove}
              />
            </div>
            <br />
            <Form.Item>
              <TextArea
                placeholder="ระบุข้อเสนอแนะ"
                defaultValue={data[0].EVALUATE_COMMENT}
                autoSize={{
                  minRows: 6,
                  maxRows: 24,
                }}
                ref={approveComment}
              />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" className="table m-auto uppercase">
                <div className="flex flex-row">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                    />
                  </svg>
                  Approve
                </div>
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    );
  };

  return (
    <div className="site-card-wrapper kanit">
      <Row className="w-full">
        <Col span={24}>
          <Card
            title={
              <>
                <h1 className="text-2xl text-center font-bold pl-0 p-3">
                  EVALUATE FORM
                </h1>
                <h1 className="text-[16px] text-center font-bold pl-0 p-3 mb-3 uppercase">
                  การประเมินการปฏิบัติงานผู้ส่งมอบด้านการให้บริการและการขนส่งวัตถุดิบ
                </h1>
              </>
            }
            bordered={false}
          >
            <Tabs
              activeKey={activeTabView}
              onChange={handleTabsView}
              centered
              items={[
                {
                  label: "Evaluate FORM",
                  key: "1",
                  children: (
                    <Form onFinish={submitForm} form={save_draft}>
                      <Supplier_Eva
                        value={evaluate_vendors.temp_state_filter.vendor}
                        supplier_list={evaluate_vendors?.vendor_list}
                      />
                      <ReportMonth
                        dateFormat={dateFormat}
                        month={month}
                        moment={moment}
                        setSelectMonth={setSelectMonth}
                        convert_year_th={convert_year_th}
                      />
                      <div className="clear-both">
                        <GroupTopic
                          topicGroup={evaluate_vendors?.evaluate_form}
                          score={score}
                          setScore={setScore}
                        />
                      </div>
                      <TextArea
                        placeholder="ระบุข้อเสนอแนะ"
                        className="mb-5"
                        autoSize={{
                          minRows: 6,
                          maxRows: 24,
                        }}
                        ref={comments}
                      />
                      <Button htmlType="submit">SAVE Draft</Button>
                    </Form>
                  ),
                },
                {
                  label: "DRAFT",
                  key: "2",
                  children: (
                    <>
                      <Table
                        dataSource={evaluate_vendors?.evaluate_pending}
                        columns={[
                          ...schema(evaluate_vendors?.evaluate_pending),
                          {
                            title: "Action",
                            key: "action",
                            render: (record) => (
                              <Button onClick={() => openDraftDrawer(record)}>
                                <div className="flex flex-row uppercase">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-5 mr-2"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                    />
                                  </svg>
                                  edit draft
                                </div>
                              </Button>
                            ),
                          },
                        ]}
                        pagination={{
                          pageSize: pageSize,
                          pageSizeOptions: [
                            "5",
                            "10",
                            "20",
                            "50",
                            "100",
                            "200",
                          ],
                          onShowSizeChange: (current, size) =>
                            setPageSize(size),
                          position: ["bottomCenter"],
                        }}
                      />
                      <DraftDrawer
                        open={draftDrawerOpen}
                        onClose={() => setDraftDrawerOpen(false)}
                        data={draftData}
                      />
                    </>
                  ),
                },
                {
                  label: "CONFIRM",
                  key: "3",
                  children: (
                    <>
                      <Table
                        dataSource={evaluate_vendors?.evaluate_confirm}
                        columns={[
                          ...schema(evaluate_vendors?.evaluate_confirm),
                          {
                            title: "Action",
                            key: "action",
                            render: (record) => {
                              if (String(record.FLAG_STATUS).toLowerCase() === "waiting") {
                                return (
                                  <Button
                                    className="uppercase"
                                    onClick={() => openConfirmDrawer(record)}
                                  >
                                    <div className="flex flex-row">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-5 mr-2"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                                        />
                                      </svg>
                                      Approve
                                    </div>
                                  </Button>
                                );
                              } else {
                                return (
                                  <Button
                                    className="uppercase"
                                    onClick={savePDF.bind(this, record)}
                                  >
                                    <div className="flex flex-row">
                                      <FilePdfOutlined className="text-[16px] mr-2"/>
                                      Save AS PDF
                                    </div>
                                  </Button>
                                ); // Or render a different button or nothing if needed
                              }
                            },
                          },
                        ]}
                        pagination={{
                          pageSize: pageSize,
                          pageSizeOptions: [
                            "5",
                            "10",
                            "20",
                            "50",
                            "100",
                            "200",
                          ],
                          onShowSizeChange: (current, size) =>
                            setPageSize(size),
                          position: ["bottomCenter"],
                        }}
                      />
                      <ConfirmDrawer
                        open={confirmDrawerOpen}
                        onClose={() => setConfirmDrawerOpen(false)}
                        data={confirmData}
                      />
                    </>
                  ),
                },
                {
                  label: "SUMMARY SCORE",
                  key: "4",
                  children: (
                    <GradingTable
                      evaResult={evaluate_vendors?.evaluate_result_table}
                    />
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
      <style>
        {`
            .custom-table .ant-table-cell {
              font-size: 16px;
            }
            .ant-drawer-header-title .ant-drawer-close {
              display:none;
            }
          `}
      </style>
    </div>
  );
};

export default Evaluate;
