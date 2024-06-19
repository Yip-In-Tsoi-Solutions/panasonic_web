import { FilePdfOutlined } from "@ant-design/icons";
import { Button } from "antd";
import generatePDF from "../../../../javascript/generate_pdf/buyer_reason_pdf/generate_pdf";
import axios from "axios";

const Buyer_reason_pdf = ({
  baseUrl,
  token_id,
  page_title,
  buyer_data,
  filterData,
}) => {
  const load_data_Topdf = async () => {
    const response = await axios.post(
      `${baseUrl}/api/buyerlist/export_pdf`,
      {
        queryString: filterData
      },
      {
        headers: {
          Authorization: `Bearer ${token_id}`,
        },
      }
    );
    if (response.status === 200) {
      generatePDF(response.data, page_title);
    }
  };
  return (
    <>
      <Button
        disabled={buyer_data.length > 0 ? false : true}
        onClick={load_data_Topdf.bind(this)}
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
export default Buyer_reason_pdf;
