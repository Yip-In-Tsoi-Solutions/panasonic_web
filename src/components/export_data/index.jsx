import { FileExcelOutlined, FileTextOutlined } from "@ant-design/icons";
import { Select } from "antd";
import axios from "axios";

const Export = (props) => {
  // action of Export Data of filter result to Excel, CSV files
  const export_to = async (val) => {
    let payload = {
      dataset: props.dataset,
      files_type: String(val).toLowerCase(),
    };
    await axios.post(`${props.baseUrl}/api/export/data`, payload);
  };
  return (
    <>
      <Select
        className="w-full ml-5"
        defaultValue="EXPORT DATA"
        onChange={export_to}
        options={[
          {
            value: "Excel",
            label: (
              <>
                <div className="flex flex-row uppercase">
                  <FileExcelOutlined className="text-xl mr-2" />
                  Excel
                </div>
              </>
            ),
          },
          {
            value: "CSV",
            label: (
              <>
                <div className="flex flex-row uppercase">
                  <FileTextOutlined className="text-xl mr-2" />
                  csv
                </div>
              </>
            ),
          },
        ]}
      />
    </>
  );
};
export default Export;
