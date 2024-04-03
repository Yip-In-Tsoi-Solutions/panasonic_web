import { Button, Layout } from "antd";
import SearchWithIcon from "../../../components/search_with_icon/components";
import { useEffect } from "react";
import { setSupplieryList } from "../actions/supplier_deliverySlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Table_withActions from "../../../components/table_withActions/components";

const { Header } = Layout;
const Supplier_delivery = () => {
  const suppliery_list = useSelector(
    (state) => state.supplier_delivery.suppliery_list
  );
  const dispatch = useDispatch();
  async function fetchSupplierAPI() {
    try {
      const response = await axios.get("/api/supplier_list");
      response.status === 200
        ? dispatch(setSupplieryList(response.data))
        : dispatch(setSupplieryList(...suppliery_list));
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchSupplierAPI();
  }, []);
  function diff_days(receive_date, promise_date, po_qty, receive_qty) {
    return receive_date - promise_date === 0 && po_qty - receive_qty === 0
      ? 0
      : 1;
  }
  const newData = suppliery_list.map((i) => {
    const diff_day = diff_days(
      i["Receive Date"],
      i["Promise Date"],
      i["PO QTY"],
      i["Received QTY"]
    );
    return {
      item_no: i["Item No"],
      iten_name: i["Item Name"],
      uom: i.UOM,
      transaction: i.Transaction,
      buyer: i.Buyer,
      po_no: i["PO No"],
      po_release: i["PO release"],
      vendor: i["Vendor"],
      po_qty: parseInt(i["PO QTY"]),
      received_qty: parseInt(i["Received QTY"]),
      need_by_date: i["Need By Date"],
      promis_date: i["Promise Date"],
      received_date: i["Receive Date"],
      diff_day: diff_day,
      days_more: diff_day < -3 ? 1 : "",
      before_3_days: diff_day === -3 ? 1 : "",
      before_2_days: diff_day === -2 ? 1 : "",
      before_1_days: diff_day === -1 ? 1 : "",
      on_time: diff_day === 0 ? 1 : "",
      delay_1_day: diff_day === 1 ? 1 : "",
      delay_2_days: diff_day === 2 ? 1 : "",
      delay_3_days: diff_day === 3 ? 1 : "",
      delay_3_days_more: diff_day > 3 ? 1 : "",
      status:
        diff_day == 0
          ? "On Time"
          : diff_day == 1
          ? "Delay 1 Day"
          : diff_day == 2
          ? "Delay 2 Day"
          : diff_day == 3
          ? "Delay 3 Day"
          : diff_day > 3
          ? "Delay 3 Days More"
          : diff_day < -3
          ? "Before 3 Days More"
          : diff_day === -3
          ? "Before 3 Days"
          : diff_day === -2
          ? "Before 2 Days"
          : diff_day === -1
          ? "Before 1 Day"
          : "",
      t_id: i['T_ID']
    };
  });
  console.log(newData);
  return (
    <>
      {/* <Header
        style={{
          padding: 0,
          background: "white",
        }}
      >
        <div className="flex p-10 pt-[20px]">
          <SearchWithIcon />
          <Button
            type="button"
            className="w-[160px] h-10 mt-5 bg-[#006254] text-[white] font-bold uppercase"
          >
            Import DATA +
          </Button>
        </div>
      </Header> */}
    </>
  );
};
export default Supplier_delivery;
