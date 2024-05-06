import { useDispatch } from "react-redux";
import { setConfirmModal } from "../actions/confirm_modalSlice";
import { Button } from "antd";

const Confirm_btn = (props) => {
  const dispatch = useDispatch();
  return (
    <>
      <Button
        disabled={props.confirmBtnStatus}
        onClick={() => dispatch(setConfirmModal(true))}
        className="float-left mt-2 bg-[#006254] text-[white] font-bold uppercase rounded-2xl border-solid border-2 border-[#006254]"
      >
        Confirm
      </Button>
    </>
  );
};
export default Confirm_btn;
