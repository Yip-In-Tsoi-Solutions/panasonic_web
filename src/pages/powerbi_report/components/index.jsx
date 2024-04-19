import { Button, Form, Input, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ListViewWithDrawer from "../../../components/ListViewWithDrawer/components";
import { setListView } from "../../../components/ListViewWithDrawer/actions/list_viewSlice";
import schema from "../../../javascript/print_schema";

const PowerBi_report = () => {
  const disPatch = useDispatch();
  const dashboard = useSelector((state) => state.list_view.list_view);
  const [powerbi, settingPowerBi] = useState({
    reportName: "",
    url: "",
  });
  async function fetchPowerBi_report() {
    const response = await axios.get("/api/powerbi_dashboard");
    response.status === 200
      ? disPatch(setListView(response.data))
      : disPatch(setListView(...dashboard));
  }
  useEffect(() => {
    fetchPowerBi_report();
  }, []);
  const handleChange = (e, key) => {
    settingPowerBi((prevState) => ({
      ...prevState,
      [key]: e.target.value,
    }));
  };
  const add_powerbi = async () => {
    try {
      let payload = {
        reportName: powerbi.reportName,
        url: powerbi.url,
      };
      axios.post("/api/powerbi_connect", payload);
    } catch (error) {
      console.log(error);
    }
  };
  const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
  const powerbi_addCondition =
    powerbi.reportName != "" && powerbi.url != "" ? false : true;
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
                name="name"
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
                name="url"
                placeholder="URL"
                onChange={(e) => handleChange(e, "url")}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="rounded-md"
                disabled={powerbi_addCondition}
                style={{
                  backgroundColor:
                    powerbi.reportName != "" && powerbi.url != ""
                      ? "#006254"
                      : "#f5f5f5",
                }}
              >
                ADD POWER BI
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
      <div className="clear-both">
        {/* <Table
          dataSource={dashboard}
          columns={schema(dashboard)}
          // columns={[
          //   {
          //     title: "platform",
          //     dataIndex: "platform",
          //     key: "platform",
          //     render: ()=> {
          //       <></>
          //     }
          //   },
          // ].concat(schema(dashboard))}
        /> */}
        <ListViewWithDrawer listView_data={dashboard} />
      </div>
    </div>
  );
};
export default PowerBi_report;
