import { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setListView } from "../../../components/PowerBi_report_list/actions/list_viewSlice";
import Overview_all_report from "../../../components/PowerBi_report_list/components/overview_all_report";
import axios from "axios";

const PowerBi_report_list = (props) => {
  const disPatch = useDispatch();
  const dashboard = useSelector((state) => state.list_view.list_view);
  async function fetchPowerBi_report() {
    try {
      const response = await axios.get(`${props.baseUrl}/api/powerbi_dashboard`, {
        headers: {
          Authorization: `Bearer ${props.token_id}`,
        },
      });
      response.status === 200
        ? disPatch(setListView(response.data))
        : disPatch(setListView(...dashboard));
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchPowerBi_report();
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold pl-0 p-3 mb-5 uppercase">Report Summarize</h1>
      <div className="clear-both">
        <Overview_all_report listView_data={dashboard} />
      </div>
    </div>
  );
};
export default memo(PowerBi_report_list);
