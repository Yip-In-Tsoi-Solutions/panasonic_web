import {
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Drawer,
  Form,
  Input,
  List,
  Row,
  Space,
  Table,
  Tabs,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { memo, useEffect, useState } from "react";
import {
  setEvaluateConfirm,
  setEvaluatePending,
  setEvaluateResultTable,
  setForm,
  setVendorList,
} from "../actions/evaluate_formSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";
import GradingTable from "../../../components/grading/components/grading";
import GroupTopic from "../../../components/evaluateform/group_topic";
import Group_topic_evaluate_update from "../../../components/evaluateform/group_topic_evaluate_update";
import convert_year_th from "../../../javascript/convert_year_th";
import moment from "moment";
import ReportMonth from "../../../components/evaluateform/select_report_month";
import Supplier_Eva from "../../../components/evaluateform/select_supplier_list/index";
import GroupedSupplierList from "../../../components/evaluateform/group_supplier";
import schema from "../../../javascript/print_schema";
import { CloseCircleOutlined, FilePdfOutlined } from "@ant-design/icons";
import generatePDF from "../../../javascript/generate_pdf/evaluation_pdf/generate_pdf";
import Update_evaluate from "../../../components/evaluateform/update_evaluate";
import Approve_evaluate from "../../../components/evaluateform/approve_evaluate";
const dateFormat = "DD/MM/YYYY";
const { Panel } = Collapse;

const Evaluate = (props) => {
  // action
  const [form] = useForm();
  const [EvaluateUpdateForm] = useForm();
  const dispatch = useDispatch();
  // state
  const evaluate_vendors = useSelector((state) => state.evaluate_vendors);

  // Evaluation Draft State
  const [activeTabView, setActiveTabView] = useState("1");
  const [pageSize, setPageSize] = useState(5);
  const [month, setSelectMonth] = useState("");
  const [score, setScore] = useState([]);
  const [comments, setComment] = useState("");

  // Evaluation Continute State
  const [evaluate_id, setEvaluateId] = useState("");
  const [EvaluateContinuteForm, setEvaContinuteForm] = useState(false);
  const [evaluateSupplier, setEvaluateSupplier] = useState("");
  const [questionList, setQuestList] = useState([]);
  const [formStatus, setSelectStatus] = useState("");
  async function fetchDropdownVendor() {
    try {
      const response = await axios.get(`${props.baseUrl}/api/dropdown/vendor`, {
        headers: {
          Authorization: `Bearer ${props.token_id}`,
        },
      });
      response.status === 200
        ? dispatch(setVendorList(response.data))
        : dispatch(setVendorList(...evaluate_vendors?.vendor_list));
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchEvaluateTopic() {
    try {
      const response = await axios.get(`${props.baseUrl}/api/evaluate/topic`, {
        headers: {
          Authorization: `Bearer ${props.token_id}`,
        },
      });
      response.status === 200
        ? dispatch(setForm(response.data))
        : dispatch(setForm(...evaluate_vendors?.evaluate_form));
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchEvaluate() {
    try {
      const response = await axios.get(
        `${props.baseUrl}/api/evaluate/summary_score`,
        {
          headers: {
            Authorization: `Bearer ${props.token_id}`,
          },
        }
      );
      response.status === 200
        ? dispatch(setEvaluateResultTable(response.data))
        : dispatch(
            setEvaluateResultTable(...evaluate_vendors?.evaluate_result_table)
          );
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchEvaluateDraft() {
    try {
      const response = await axios.get(`${props.baseUrl}/api/evaluate/draft`, {
        headers: {
          Authorization: `Bearer ${props.token_id}`,
        },
      });
      response.status === 200
        ? dispatch(setEvaluatePending(response.data))
        : dispatch(setEvaluatePending(...evaluate_vendors?.evaluate_pending));
    } catch (error) {
      if (error) {
        window.location.href = "/error_login";
      }
    }
  }
  async function fetchEvaluateConfirm() {
    try {
      const response = await axios.get(
        `${props.baseUrl}/api/evaluate/confirm`,
        {
          headers: {
            Authorization: `Bearer ${props.token_id}`,
          },
        }
      );
      response.status === 200
        ? dispatch(setEvaluateConfirm(response.data))
        : dispatch(setEvaluateConfirm(...evaluate_vendors?.evaluate_confirm));
    } catch (error) {
      if (error) {
        window.location.href = "/error_login";
      }
    }
  }
  useEffect(() => {
    fetchEvaluateTopic();
    fetchDropdownVendor();
    fetchEvaluate();
    fetchEvaluateDraft();
    fetchEvaluateConfirm();
  }, []);

  const { vendor } = evaluate_vendors.temp_state_filter;
  const pageToipic =
    "การประเมินการปฏิบัติงานผู้ส่งมอบด้านการให้บริการและการขนส่งวัตถุดิบ";

  const handleTabsView = async (key) => {
    setActiveTabView(key);
  };
  // submit for creating Evaluate FORM
  const submitForm = async (val) => {
    try {
      let payload = {
        supplier: vendor, // Assigning the value of the variable `vendor` to the key `supplier`.
        evaluate_date: month, // Assigning the value of the variable `month` to the key `evaluate_date`.
        comments: comments,
        eval_form: score,
        flag_status: score.reduce((acc, curr) => {
          // Using the reduce function on the `score` array to transform it into an object.
          return curr.EVALUATE_TOPIC_SCORE != 0 ? "waiting" : "draft";
        }, {}),
        full_score: score.length * 5, // Calculating the full score based on the length of the `score` array and multiplying it by 5.
      };
      const response = await axios.post(
        `${props.baseUrl}/api/evaluate/sending_form`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${props.token_id}`,
          },
        }
      );
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const closeEvaUpdate = async () => {
    setEvaContinuteForm(false);
    EvaluateUpdateForm.resetFields();
  };
  // query to display current evaluate form
  const selectedEvaUpdate = async (record) => {
    try {
      // Define the payload for the API request
      const payload = {
        eva_id: record.EVALUATE_ID,
        supplier: record.SUPPLIER,
        evaluate_date: record.EVALUATE_DATE,
        flag_status: record.FLAG_STATUS,
      };
      // Make the API request to update the form
      const response = await axios.post(
        `${props.baseUrl}/api/evaluate/update_form`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${props.token_id}`,
          },
        }
      );
      // Check if the response status is 200 (OK)
      if (response.status === 200) {
        setEvaContinuteForm(true);
        setEvaluateSupplier(record.SUPPLIER);
        setEvaluateId(record?.EVALUATE_ID);
        setQuestList(response.data);
        setSelectStatus(record.FLAG_STATUS);
        EvaluateUpdateForm.resetFields();
      } else {
        setEvaContinuteForm(false);
        setEvaluateSupplier("");
        setQuestList([]);
      }
    } catch (error) {
      if (error.message === "Invalid record data") {
        // Handle invalid record data error
        console.error("Invalid record data:", record);
        // Optionally, you can set state or show an error message to the user
      } else {
        // Redirect to the error page in case of an API error
        window.location.href = "/error_not_found";
      }
    }
  };
  // update
  const submitUpdateEvaluate = async () => {
    const updatePayload = {
      supplier: evaluateSupplier, // Assigning the value of the variable `vendor` to the key `supplier`.
      evaluate_date: questionList[0]?.EVALUATE_DATE, // Assigning the value of the variable `month` to the key `evaluate_date`.
      comments: comments,
      updateScore: score,
      flag_status: score.reduce((acc, curr) => {
        // Using the reduce function on the `score` array to transform it into an object.
        return curr.EVALUATE_TOPIC_SCORE != 0 ? "waiting" : "draft";
      }, {}),
      full_score: score.length * 5, // Calculating the full score based on the length of the `score` array and multiplying it by 5.
    };
    const response = await axios.put(
      `${props.baseUrl}/api/evaluate/form/update/${evaluate_id}`,
      updatePayload,
      {
        headers: {
          Authorization: `Bearer ${props.token_id}`,
        },
      }
    );
    if (response.status === 200) {
      window.location.reload();
    }
  };
  //Approve
  const submitApprove = async () => {
    const updatePayload = {
      supplier: evaluateSupplier, // Assigning the value of the variable `vendor` to the key `supplier`.
      evaluate_date: questionList[0]?.EVALUATE_DATE, // Assigning the value of the variable `month` to the key `evaluate_date`.
      comments: comments,
      updateScore: score,
      flag_status: "confirm",
      full_score: score.length * 5, // Calculating the full score based on the length of the `score` array and multiplying it by 5.
    };
    const response = await axios.put(
      `${props.baseUrl}/api/evaluate/form/update/${evaluate_id}`,
      updatePayload,
      {
        headers: {
          Authorization: `Bearer ${props.token_id}`,
        },
      }
    );
    if (response.status === 200) {
      window.location.reload();
    }
  };
  let rows_id = 0;
  const savePDF = async (
    evaluateId,
    supplier,
    evaluate_date,
    flag_status,
    department
  ) => {
    let payload = {
      evaluate_id: evaluateId,
      supplier: supplier,
      evaluate_date: evaluate_date,
      flag_status: flag_status,
    };
    const response = await axios.post(
      `${props.baseUrl}/api/evaluate/generate_pdf`,
      payload,
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
  return (
    <>
      <div className="site-card-wrapper kanit">
        <Row>
          <Col span={24}>
            <Card
              title={
                <>
                  <h1 className="text-2xl text-center font-bold pl-0 p-3">
                    EVALUATE FORM
                  </h1>
                  <h1 className="text-[16px] text-center font-bold pl-0 p-3 mb-3 uppercase">
                    {pageToipic}
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
                    label: "Evaluate FORM".toUpperCase(),
                    key: "1",
                    children: (
                      <Form onFinish={submitForm} form={form}>
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
                          <div className="text-right">
                            <p className="text-[16px]">
                              ระดับความพึงพอใจ (Satisfaction Level)
                            </p>
                          </div>
                          <div className="text-left">
                            <GroupTopic
                              topicGroup={evaluate_vendors?.evaluate_form}
                              score={score}
                              setScore={setScore}
                            />
                          </div>
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
                              <div className="flex flex-row">
                                <Button
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
                                    SAVE Draft
                                  </div>
                                </Button>
                              </div>
                            </div>
                          </div>
                          <br />
                        </div>
                      </Form>
                    ),
                  },
                  {
                    label: "draft".toUpperCase(),
                    key: "2",
                    children: (
                      <>
                        <br />
                        <Table
                          dataSource={evaluate_vendors?.evaluate_pending}
                          columns={schema(
                            evaluate_vendors?.evaluate_pending
                          ).concat([
                            {
                              title: "Action",
                              key: `action_${rows_id + 1}`,
                              render: (record) => (
                                <>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-5 cursor-pointer"
                                    onClick={() => selectedEvaUpdate(record)}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                    />
                                  </svg>
                                  <Update_evaluate
                                    questionList={questionList}
                                    EvaluateContinuteForm={
                                      EvaluateContinuteForm
                                    }
                                    evaluateSupplier={evaluateSupplier}
                                    submitUpdateEvaluate={submitUpdateEvaluate}
                                    EvaluateUpdateForm={EvaluateUpdateForm}
                                    closeEvaUpdate={closeEvaUpdate}
                                    record={record}
                                    score={score}
                                    setScore={setScore}
                                    setComment={setComment}
                                    formStatus={formStatus}
                                  />
                                </>
                              ),
                            },
                          ])}
                          scroll={{ x: "max-content" }}
                          pagination={{
                            pageSize: pageSize, // Set the initial page size
                            defaultPageSize: 5,
                            pageSizeOptions: [
                              "5",
                              "10",
                              "20",
                              "50",
                              "100",
                              "200",
                            ],
                            onShowSizeChange: (current, size) =>
                              setPageSize(size), // Function to handle page size changes
                            position: ["bottomCenter"],
                          }}
                        />
                      </>
                    ),
                  },
                  {
                    label: "confirm".toUpperCase(),
                    key: "3",
                    children: (
                      <Table
                        dataSource={evaluate_vendors?.evaluate_confirm}
                        columns={schema(
                          evaluate_vendors?.evaluate_confirm
                        ).concat([
                          {
                            title: "ACTION",
                            render: (a, record) => (
                              <>
                                <Button
                                  className="uppercase"
                                  onClick={() => selectedEvaUpdate(record)}
                                >
                                  <div className="flex flex-row">
                                    {record?.FLAG_STATUS === "waiting" ? (
                                      <div className="flex flex-row">
                                        {" "}
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          strokeWidth={1.5}
                                          stroke="currentColor"
                                          className="size-5 mr-3"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
                                          />
                                        </svg>
                                        Approve
                                      </div>
                                    ) : (
                                      <div
                                        className="flex flex-row"
                                        onClick={savePDF.bind(
                                          this,
                                          record?.EVALUATE_ID,
                                          record?.SUPPLIER,
                                          record?.EVALUATE_DATE,
                                          record?.FLAG_STATUS,
                                          record?.DEPARTMENT
                                        )}
                                      >
                                        {" "}
                                        <FilePdfOutlined className="text-[18px] mr-3" />
                                        SAVE as PDF
                                      </div>
                                    )}
                                  </div>
                                </Button>
                                <Approve_evaluate
                                  questionList={questionList}
                                  EvaluateContinuteForm={EvaluateContinuteForm}
                                  evaluateSupplier={evaluateSupplier}
                                  submitUpdateEvaluate={submitApprove}
                                  EvaluateUpdateForm={EvaluateUpdateForm}
                                  closeEvaUpdate={closeEvaUpdate}
                                  record={record}
                                  score={score}
                                  setScore={setScore}
                                  setComment={setComment}
                                  formStatus={formStatus}
                                />
                              </>
                            ),
                          },
                        ])}
                      />
                    ),
                  },
                  {
                    label: "SUMMARY SCORE".toUpperCase(),
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
    </>
  );
};

export default memo(Evaluate);
