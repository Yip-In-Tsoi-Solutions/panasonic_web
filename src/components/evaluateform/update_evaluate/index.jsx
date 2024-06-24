import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Drawer, Form, Input, Space } from "antd";
import { memo } from "react";
import Group_topic_evaluate_update from "../group_topic_evaluate_update";
import TextArea from "antd/es/input/TextArea";

const Update_Evaluate = ({
  questionList,
  EvaluateContinuteForm,
  evaluateSupplier,
  submitUpdateEvaluate,
  EvaluateUpdateForm,
  closeEvaUpdate,
  record,
  score,
  setScore,
  setComment,
  formStatus,
}) => {
  return (
    <>
      <Drawer
        width={window.innerWidth}
        open={EvaluateContinuteForm}
        footer={null}
        extra={
          <Space>
            <CloseCircleOutlined
              onClick={closeEvaUpdate}
              className="text-[24px] text-left"
            />
          </Space>
        }
      >
        <div>
          <h2 className="text-center text-[18px] font-normal">
            ทำการประเมินบริษัท
          </h2>
        </div>
        <h1 className="text-center text-[24px] font-bold">
          {evaluateSupplier}
        </h1>
        <br />
        <Form onFinish={submitUpdateEvaluate} form={EvaluateUpdateForm}>
          <div className="flex-row">
            <div className="float-left">
              <p className="text-[16px]">
                การประเมินการปฏิบัติงานผู้ส่งมอบด้านการให้บริการและการขนส่งวัตถุดิบ
              </p>
            </div>
            <Input
              className="w-[140px] float-right mb-5"
              value={new Date(record?.EVALUATE_DATE)
                .toLocaleDateString("en-GB")
                .split("/")
                .reverse()
                .join("-")}
            />
          </div>
          <div className="clear-both">
            <div className="text-right">
              <p className="text-[16px]">
                ระดับความพึงพอใจ (Satisfaction Level)
              </p>
            </div>
            <div className="text-left">
              <Group_topic_evaluate_update
                topicGroup={questionList}
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
                  defaultValue={questionList[0]?.EVALUATE_COMMENT}
                  autoSize={{
                    minRows: 6,
                    maxRows: 24,
                  }}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Form.Item>
              <div className="table m-auto mt-5">
                <div className="flex flex-row">
                  <Button htmlType="submit" className="uppercase ml-2">
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
                          d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                        />
                      </svg>
                      {String(formStatus).toLowerCase() === "waiting"
                        ? "APPROVE"
                        : "UPDATE FORM"}
                    </div>
                  </Button>
                </div>
              </div>
            </div>
            <br />
          </div>
        </Form>
      </Drawer>
    </>
  );
};
export default memo(Update_Evaluate);
