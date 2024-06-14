import { Button, Drawer, Form, Input, List, Tag, Tooltip } from "antd";
import { memo, useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "antd/es/form/Form";
import Iframe from "react-iframe";

const PowerBi_reportAdmin = (props) => {
  const [form] = useForm();
  const [powerbi, settingPowerBi] = useState({
    reportName: "",
    url: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [getReport, setReport] = useState([]);
  const [reportName, setReportName] = useState("");
  const [reportURL, setReportURL] = useState("");
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
      form.resetFields();
      await axios.post(`${props.baseUrl}/api/powerbi_connect`, payload, {
        headers: {
          Authorization: `Bearer ${props.token_id}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
  const powerbi_addCondition =
    powerbi.reportName != "" && powerbi.url != "" ? false : true;

  async function fetchPowerBi_report() {
    try {
      const response = await axios.get(
        `${props.baseUrl}/api/powerbi_dashboard`,
        {
          headers: {
            Authorization: `Bearer ${props.token_id}`,
          },
        }
      );
      response.status === 200
        ? setReport(response.data)
        : setReport(...getReport);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchPowerBi_report();
  }, []);
  const previewDashboard = (e) => {
    setIsModalOpen(true);
    setReportName(e.REPORT_NAME);
    setReportURL(e.REPORT_URL);
  };
  const removeReport = async(url, id)=> {
    await axios.delete(`${props.baseUrl}/api/powerbi_dashboard/${id}/${btoa(url)}`, {
      headers: {
        Authorization: `Bearer ${props.token_id}`,
      },
    });
  }
  return (
    <div>
      <h1 className="text-2xl font-bold pl-0 p-3 mb-5 uppercase">
        Power Bi Report (Admin User)
      </h1>
      <div className="flex flex-col">
        <Form form={form} onFinish={add_powerbi}>
          <div class="grid gap-6 mb-6 md:grid-cols-4">
            <Form.Item label="Report Name" name={"name"}>
              <Input
                placeholder="Report Name"
                onChange={(e) => handleChange(e, "reportName")}
              />
            </Form.Item>
            <Form.Item
              label="URL"
              name={"URL"}
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
        <List
          header={null}
          footer={null}
          bordered
          dataSource={getReport}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <div key={item?.REPORT_URL}>
                    <div className="flex flex-row mt-5 mb-5">
                      <h1>
                        <h1 className="font-bold">{item?.REPORT_NAME}</h1>
                      </h1>
                      <Tag className="ml-5 mr-5 text-[12px]">
                        {item?.REPORT_URL?.slice(0, 60)}
                      </Tag>
                      <div className="flex flex-row">
                        <Tooltip
                          placement="top"
                          title={"VIEW"}
                          className="mr-4"
                          onClick={() => previewDashboard(item)}
                        >
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
                        </Tooltip>
                        <Tooltip
                          placement="top"
                          title={"EDIT"}
                          className="mr-4"
                        >
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
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </Tooltip>
                        <Tooltip placement="top" title={"REMOVE REPORT"} onClick={()=> removeReport(item?.REPORT_URL, item?.REPORT_ID)}>
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
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
        {/* <Drawer
          title={reportName}
          onClose={() => setIsModalOpen(false)}
          open={isModalOpen}
          width={window.innerWidth}
        >
          <Iframe
            id="powerBiReport"
            title={reportName}
            className="w-full h-screen"
            src={reportURL}
          />
        </Drawer> */}
      </div>
    </div>
  );
};
export default memo(PowerBi_reportAdmin);
