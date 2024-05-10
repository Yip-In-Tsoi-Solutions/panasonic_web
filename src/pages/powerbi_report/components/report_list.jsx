import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setListView } from "../../../components/ListViewWithDrawer/actions/list_viewSlice";
import ListViewWithDrawer from "../../../components/ListViewWithDrawer/components";
import axios from "axios";

const PowerBi_report_list = (props) => {
  const disPatch = useDispatch();
  const dashboard = useSelector((state) => state.list_view.list_view);
  async function fetchPowerBi_report() {
    try {
      const response = await axios.get(`${props.baseUrl}/api/powerbi_dashboard`);
      response.status === 200
        ? disPatch(setListView(response.data))
        : disPatch(setListView(...dashboard));
    } catch (error) {
      console.log(error)
    }
  }
  useMemo(() => {
    fetchPowerBi_report();
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold pl-0 p-3 mb-5">Report Summarize (Delivery)</h1>
      <div className="clear-both">
        <ListViewWithDrawer listView_data={dashboard} />
      </div>
    </div>
  );
};
export default PowerBi_report_list;
