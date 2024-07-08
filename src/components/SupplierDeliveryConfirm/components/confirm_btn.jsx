import { useDispatch } from "react-redux";
import { Button, Modal, message } from "antd";
import axios from "axios";
import { resetAllState } from "../../filter_form/actions/filterSlice";
import { memo, useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const SupplierDeliveryConfirm = (props) => {
  const dispatch = useDispatch();
  const [alertMessage, setAlertMessage] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState(true);
  const { baseUrl, payload, confirmBtnStatus, setConfirm, setSuppliery_list_filter_result } = props;
  const load_toBuyer_reason = async () => {
    try {
      message.success("Loading finished", 0.7);
      setAlertMessage(false); // closed modal
      setConfirm(true); // disabled
      dispatch(resetAllState()); // clear all value
      setSuppliery_list_filter_result([])
      setTimeout(async()=> {
        await axios.post(
          `${baseUrl}/api/load_data_buyer_reason`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${props.token_id}`,
            },
          }
        );
      }, 3000)
    } catch (error) {
      if (error) {
        window.location.href = "/error_login";
      }
    }
  };
  return (
    <>
      <Button
        disabled={confirmBtnStatus}
        onClick={() => setAlertMessage(true)}
        className="float-left mt-2 bg-[#006254] text-[white] font-bold uppercase rounded-2xl border-solid border-2 border-[#006254]"
      >
        Confirm
      </Button>
      <Modal open={alertMessage} footer={null} closeIcon={null}>
        <ExclamationCircleOutlined className="text-8xl text-[red] table m-auto mb-5" />
        <h1 className="text-lg font-bold text-center text-[red]">หมายเหตุ</h1>
        <p className="text-center">
          การโอนย้ายรายการทั้งหมดไปยังหน้า Buyer Reason
          เมื่อยืนยันแล้วจะไม่สามารถทำรายการ ที่หน้านี้ได้อีกทุกกรณี
        </p>
        <div className="table flex-row m-auto mt-5 mb-5">
          <Button
            disabled={confirmBtnStatus}
            onClick={load_toBuyer_reason}
            className="bg-[#006254] text-[white] font-bold uppercase rounded-2xl border-solid border-2 border-[#006254] mr-5"
          >
            YES
          </Button>{" "}
          <Button
            type="button"
            className="bg-[white] text-[black] font-bold uppercase rounded-2xl border-solid border-2 border-[black]"
            onClick={() => setAlertMessage(false)}
          >
            NO
          </Button>
        </div>
      </Modal>
    </>
  );
};
export default memo(SupplierDeliveryConfirm);
