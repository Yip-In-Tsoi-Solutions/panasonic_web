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
      const response = await axios.get(
        `${props.baseUrl}/api/powerbi_dashboard`,
        {
          headers: {
            Authorization: `Bearer ${props.token_id}`,
          },
        }
      );
      response.status === 200
        ? disPatch(setListView(response.data))
        : disPatch(setListView(...dashboard));
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchPowerBi_report();
  }, []);
  return (
    <div className="block flex-row">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-8 mt-3 mr-3 float-left"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
        />
      </svg>
      <h1 className="text-2xl font-bold pl-0 p-3 mb-5 uppercase float-left">
        Report Summarize
      </h1>
      <p className="text-[16px] font-normal pl-0 mb-5 clear-both uppercase">
        All Report
      </p>
      <Overview_all_report className="clear-both" listView_data={dashboard} />
    </div>
  );
};
export default memo(PowerBi_report_list);
