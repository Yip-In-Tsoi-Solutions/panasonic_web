import React, { useState } from "react";
import { Button, Drawer, List, Table, Tag, Tooltip } from "antd";
const Overview_all_report = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [reportURL, setReportURL] = useState("");
  const previewDashboard = (e) => {
    setIsModalOpen(true);
    setReportName(e.REPORT_NAME);
    setReportURL(e.REPORT_URL);
  };
  const closedPop = () => {
    setIsModalOpen(false);
  };
  const fullWidth = window.innerWidth;
  return (
    <>
      <div>
        <List
          footer={null}
          bordered
          dataSource={props.listView_data}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <div key={item?.REPORT_URL}>
                    <div className="flex flex-row mt-5 mb-5">
                      <h1 className="font-bold mr-5">{item?.REPORT_NAME}</h1>
                      <div className="flex flex-row">
                        <Tooltip
                          placement="top"
                          title={"VIEW"}
                          className="mr-4"
                        >
                          <a href={item.REPORT_URL} target="_blank">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-5 cursor-pointer"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                            </svg>
                          </a>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </>
  );
};

export default Overview_all_report;
