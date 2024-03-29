import { Button, Form, Input } from "antd";
import { useState } from "react";
import Table_withActions from "../../../components/table_withActions/components";
import ListView from "../../../components/list/components";
import { useDispatch, useSelector } from "react-redux";
import { setListView } from "../../../components/list/actions/list_viewSlice";

const PowerBi_report = () => {
  const disPatch = useDispatch();
  const listView_data = useSelector((state) => state?.list_view?.list_view);
  const [powerbi, settingPowerBi] = useState({
    reportName: "",
    url: "",
  });
  const handleChange = (e, key) => {
    settingPowerBi((prevState) => ({
      ...prevState,
      [key]: e.target.value,
    }));
  };
  const add_powerbi = () => {
    let payload = {
      reportName: powerbi.reportName,
      url: powerbi.url,
    };
    disPatch(setListView(payload));
  };
  const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
  const url = "http://localhost:8123/salesfact";
  console.log(listView_data.reportName);
  return (
    <div>
      <h1 className="uppercase font-bold">PowerBi Report</h1>
      <br />
      <div className="flex flex-col">
        <Form onFinish={add_powerbi}>
          <div class="grid gap-6 mb-6 md:grid-cols-4">
            <Form.Item>
              <Input
                type="text"
                placeholder="Report Name"
                onChange={(e) => handleChange(e, "reportName")}
              />
            </Form.Item>
            <Form.Item
              rules={[
                { required: true, message: "Please input the URL!" },
                { pattern: urlPattern, message: "Please enter a valid URL!" },
              ]}
            >
              <Input
                type="text"
                placeholder="URL"
                onChange={(e) => handleChange(e, "url")}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="rounded-md"
                style={{ backgroundColor: "#006254" }}
              >
                ADD POWER BI
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
      <div className="clear-both">
        <ListView className="h-screen" />
        {/* <Table_withActions url={url}/> */}
      </div>
    </div>
  );
};
export default PowerBi_report;
