import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Modal, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  setConfirmBtnStatus,
  setConfirmModal,
} from "../../../components/confirm_supplier/actions/confirm_modalSlice";
import axios from "axios";

const Confirm_Modal = (props) => {
  const dispatch = useDispatch();
  const confirm = useSelector((state) => state.confirm_supplier.confirmModal);
  const [messageApi, contextHolder] = message.useMessage();
  const load_toBuyer_reason = () => {
    const action_inSec = 5000;
    try {
      messageApi.open({
        type: "success",
        content: `This is a success for loading to Buyer Reason page, and thses message will close in ${
          action_inSec / 1000
        } seconds`,
        duration: action_inSec / 1000,
      });
      setTimeout(async () => {
        const response = await axios.post(
          "http://localhost:8080/api/load_data_buyer_reason",
          props.payload
        );
        if (response.status === 200) {
          clearFilter();
          dispatch(setConfirmBtnStatus(false));
        } else {
          dispatch(setConfirmBtnStatus(true));
        }
      }, action_inSec);
    } catch (error) {
      if (error) {
        messageApi.open({
          type: "error",
          content: "This is an error message",
        });
        setTimeout(() => {
          dispatch(setBuyer_reason([]));
        }, action_inSec);
      }
    }
  };
  return (
    <>
      <Modal open={confirm} footer={null} closeIcon={null}>
        <div role="alert">
          <ExclamationCircleOutlined className="text-8xl text-[red] table m-auto mb-5" />
          <h1 className="text-lg font-bold text-center text-[red]">หมายเหตุ</h1>
          <p className="text-center">
            การโอนย้ายรายการทั้งหมดไปยังหน้า Buyer Reason
            เมื่อยืนยันแล้วจะไม่สามารถทำรายการ ที่หน้านี้ได้อีกทุกกรณี
          </p>
          <br />
          <div className="table flex-row m-auto">
            {contextHolder}
            <Button
              type="button"
              onClick={load_toBuyer_reason}
              className="bg-[#006254] text-[white] font-bold uppercase rounded-2xl border-solid border-2 border-[#006254] mr-5"
            >
              YES
            </Button>{" "}
            <Button
              type="button"
              className="bg-[white] text-[black] font-bold uppercase rounded-2xl border-solid border-2 border-[black]"
              onClick={() => dispatch(setConfirmModal(false))}
            >
              NO
            </Button>
          </div>
          <br />
        </div>
      </Modal>
    </>
  );
};
export default Confirm_Modal;
