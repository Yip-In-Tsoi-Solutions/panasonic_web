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
import { CloseCircleOutlined } from "@ant-design/icons";

const dateFormat = "DD/MM/YYYY";

const Evaluate = (props) => {
  const [supplierName, setSupplierName] = useState("");
  const [save_draft] = useForm();
  const [draft_form] = useForm();
  const dispatch = useDispatch();
  const updateComment = useRef("");
  const comments = useRef("");
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

  const updateConfirmData = async (values) => {
    try {
      const response = await axios.put(
        `${props.baseUrl}/api/evaluate/form/update/${confirmData.EVALUATE_ID}`,
        values,
        { headers: { Authorization: `Bearer ${props.token_id}` } }
      );
      if (response.status === 200) {
        setConfirmDrawerOpen(false);
        fetchEvaluateConfirm();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const DraftDrawer = ({ open, onClose, data }) => {
    const [SelectScore, setSelectScore] = useState([]);
    if (!data || data.length === 0) {
      // Handle case where data is not available or empty
      return "";
    }
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
            moment(data?.EVALUATE_DATE).format("YYYY-MM-DD")
          )}
          form={draft_form}
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
                value={moment(data?.EVALUATE_DATE).format("YYYY-MM-DD")}
              />
            </div>
            <div className="clear-both">
              <Group_topic_evaluate_update
                topicGroup={data}
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
              <Button htmlType="submit" className="table m-auto">
                UPDATE EVALUATE
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    );
  };
  const ConfirmDrawer = ({ open, onClose, data }) => (
    <Drawer
      title="Approve Evaluation"
      placement="right"
      onClose={onClose}
      visible={open}
      width={720}
    >
      <Form onFinish={updateConfirmData} initialValues={data}>
        {/* Form fields for approving evaluation */}
        <Button htmlType="submit">Approve</Button>
      </Form>
    </Drawer>
  );

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
                                Edit
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
                            render: (record) => (
                              <Button onClick={() => openConfirmDrawer(record)}>
                                {record.FLAG_STATUS === "waiting"
                                  ? "Approve"
                                  : "View"}
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
