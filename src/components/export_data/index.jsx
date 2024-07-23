import { FileExcelOutlined, FileTextOutlined } from "@ant-design/icons";
import { CSVDownload, CSVLink } from "react-csv";
import { Button } from "antd";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const exportToXlsx = (data, filename) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Convert the data to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Generate a buffer
  const workbookOut = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Create a Blob object and save it
  const blob = new Blob([workbookOut], { type: "application/octet-stream" });
  saveAs(blob, `${filename}.xlsx`);
};
const Export = (props) => {
  const { dataset, export_fileName } = props;
  return (
    <>
      <div className="flex flex-row">
        <Button
          disabled={dataset.length > 0 ? false : true}
          className="uppercase"
        >
          <CSVLink filename={export_fileName} data={dataset}>
            <div className="flex flex-row">
              <FileTextOutlined className="text-xl mr-2" />
              Save as CSV
            </div>
          </CSVLink>
        </Button>
        <Button
          disabled={dataset.length > 0 ? false : true}
          onClick={() => exportToXlsx(dataset, export_fileName)}
          className="ml-5 uppercase"
        >
          <div className="flex flex-row">
            <FileExcelOutlined className="text-xl mr-2" />
            Save as excel
          </div>
        </Button>
      </div>
    </>
  );
};
export default Export;
