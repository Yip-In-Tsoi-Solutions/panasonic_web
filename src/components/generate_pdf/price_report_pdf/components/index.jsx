import { FilePdfOutlined } from "@ant-design/icons";
import { Button } from "antd";
import generatePDF from "../../../../javascript/generate_pdf/price_report_pdf/generate_pdf";
const PriceReport_PDF = ({ page_title, pdf_data }) => {
  const load_to_pdf = () => {
    generatePDF(pdf_data, page_title);
  };
  return (
    <>
      <Button
        disabled={pdf_data.length > 0 ? false : true}
        onClick={load_to_pdf.bind(this)}
        className="uppercase ml-5"
      >
        <div className="flex flex-row">
          <FilePdfOutlined className="mr-[10px] text-[20px]" />
          {"Save as PDF"}
        </div>
      </Button>
    </>
  );
};
export default PriceReport_PDF;
