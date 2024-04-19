import React, { useState } from "react";
import { Button, Drawer, List, Tag } from "antd";
import Iframe from "react-iframe";
import { FileExcelOutlined, FilePdfOutlined } from "@ant-design/icons";

const ListViewWithDrawer = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [reportURL, setReportURL] = useState("");

  const popUp = (e) => {
    setIsModalOpen(true);
    setReportName(e.report_name);
    setReportURL(e.report_url);
  };

  const closedPop = () => {
    setIsModalOpen(false);
  };
  const fullWidth = window.innerWidth;
  return (
    <>
      <div>
        <List
          header={<div className="font-bold">Power Bi Report</div>}
          footer={null}
          bordered
          dataSource={props.listView_data}
          renderItem={(item) => (
            <List.Item onClick={() => popUp(item)}>
              <List.Item.Meta
                title={
                  <Tag>
                    <h1 className="cursor-pointer">{item.report_name}</h1>
                  </Tag>
                }
              />
            </List.Item>
          )}
        />
        <Drawer
          title={reportName}
          onClose={closedPop}
          open={isModalOpen}
          width={fullWidth}
        >
          <Iframe
            id="powerBiReport"
            title={reportName}
            className="w-full h-screen"
            src={reportURL}
          />
          <div className="table mx-auto">
            <br />
            <h1 className="uppercase text-center text-lg font-bold">
              Report Export
            </h1>
            <FilePdfOutlined className="text-2xl cursor-pointer mr-6" />
            <FileExcelOutlined className="text-2xl cursor-pointer" />
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default ListViewWithDrawer;
