import { FilePdfOutlined } from "@ant-design/icons";
import { Button, Select } from "antd";
import axios from "axios";
import { resetSlice } from "../actions/generatePDF_Slice";
import { useDispatch, useSelector } from "react-redux";
import generatePDF from "../../../../javascript/generate_pdf/goods_return_pdf/generate_pdf";
import { clear_Alldocs } from "../../../../pages/goods_return/actions/goods_returnSlice";
const Goods_return_pdf = ({
  token_id,
  page_title,
  return_doc,
  baseUrl,
  dataset,
}) => {
  const dispatch = useDispatch();
  const submitCreatePDF = async () => {
    try {
      let payload = {
        dataset: dataset,
      };
      const response = await axios.post(
        `${baseUrl}/api/matching_invoice/createform`,
        payload.dataset,
        {
          headers: {
            Authorization: `Bearer ${token_id}`,
          },
        }
      );
      if (response.status === 200) {
        generatePDF(dataset, dataset[0].supplier, page_title, response.data);
        dispatch(resetSlice());
        dispatch(clear_Alldocs());
      }
    } catch (error) {
      if (error) {
        window.location.href = "/error_login";
      }
    }
  };
  return (
    <>
      <Button
        disabled={dataset.length > 0 ? false : true}
        onClick={submitCreatePDF}
        className="uppercase ml-5 z-50"
      >
        <div className="flex flex-row">
          <FilePdfOutlined className="mr-[10px] text-[20px]" />
          {"Save as PDF"}
        </div>
      </Button>
    </>
  );
};
export default Goods_return_pdf;
