import React, { useState } from "react";
import { Drawer, List, Tag } from "antd";
import Iframe from "react-iframe";
// props.listView_data
const ListViewWithDrawer = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [reportURL, setReportURL] = useState("");
  const popUp = (e) => {
    setIsModalOpen(true);
    setReportName(e.reportName);
    setReportURL(e.url);
  };
  const closedPop = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div>
        <List
          header={<div className="font-bold">Power Bi Report</div>}
          footer={null}
          bordered
          dataSource={props.listView_data}
          renderItem={(item) => (
            <List.Item onClick={popUp.bind(this, item)}>
              <List.Item.Meta
                title={
                  <Tag>
                    <h1 className="cursor-pointer">{item.reportName}</h1>
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
          width={1000}
        >
          <Iframe
            title={reportName}
            className="w-full h-screen"
            src={reportURL}
            frameborder="0"
          ></Iframe>
        </Drawer>
      </div>
    </>
  );
};
export default ListViewWithDrawer;
