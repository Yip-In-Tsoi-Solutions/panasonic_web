import { Form, List, Radio, Collapse } from "antd";
import React, { memo, useState } from "react";

const { Panel } = Collapse;

const RadioGroup = memo(({ topicId, defaultValue, handleScoreChange }) => (
  <Radio.Group
    defaultValue={defaultValue}
    onChange={(e) => handleScoreChange(topicId, e.target.value)}
  >
    <Radio className="text-[12px]" value={1}>
      1
    </Radio>
    <Radio className="text-[12px]" value={2}>
      2
    </Radio>
    <Radio className="text-[12px]" value={3}>
      3
    </Radio>
    <Radio className="text-[12px]" value={4}>
      4
    </Radio>
    <Radio className="text-[12px]" value={5}>
      5
    </Radio>
  </Radio.Group>
));

const GroupedSupplierList = ({ evaluate_vendors, score, setScore }) => {
  // Extracting unique suppliers
  const suppliers = [...new Set(evaluate_vendors.map((item) => item.SUPPLIER))];

  const handleScoreChange = (topicId, value) => {
    setScore((prevScores) => ({
      ...prevScores,
      [topicId]: value
    }));
  };

  return (
    <Collapse accordion>
      {suppliers.map((supplier, index) => {
        return (
          <Panel
            header={
              <div className="flex flex-row font-bold">
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
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                  />
                </svg>
                {supplier}
              </div>
            }
            key={index}
          >
            <List
              dataSource={evaluate_vendors.filter(
                (item) => item.SUPPLIER === supplier
              )}
              renderItem={(item) => (
                <List.Item key={`${item.SUPPLIER}_${item.TOPIC_KEY_ID}`}>
                  <List.Item.Meta
                    title={
                      <>
                        <h1 className="text-[14px] font-normal">
                          {item.TOPIC_NAME}
                        </h1>
                        <Form.Item className="mt-5">
                          <RadioGroup
                            topicId={item.TOPIC_KEY_ID}
                            defaultValue={score[item.TOPIC_KEY_ID] || item.EVALUATE_TOPIC_SCORE}
                            handleScoreChange={handleScoreChange}
                          />
                        </Form.Item>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Panel>
        );
      })}
    </Collapse>
  );
};

export default memo(GroupedSupplierList);
