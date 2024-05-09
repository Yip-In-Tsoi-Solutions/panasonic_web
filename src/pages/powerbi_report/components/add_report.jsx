import { Button, Form, Input } from "antd";
import { useState } from "react";
import axios from "axios";
import { useForm } from "antd/es/form/Form";

const PowerBi_reportAdmin = () => {
  const [form] = useForm();
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
  const add_powerbi = async () => {
    try {
      let payload = {
        reportName: powerbi.reportName,
        url: powerbi.url,
      };
      form.resetFields();
      await axios.post("http://localhost:8080/api/powerbi_connect", payload);
    } catch (error) {
      console.log(error)
    }
  };
  const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
  const powerbi_addCondition =
    powerbi.reportName != "" && powerbi.url != "" ? false : true;
  return (
    <div>
      <h1 className="text-2xl font-bold pl-0 p-3 mb-5">
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
      </div>
    </div>
  );
};
export default PowerBi_reportAdmin;
