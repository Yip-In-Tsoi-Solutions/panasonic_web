import { DatePicker, Table } from "antd";
import schema from "../../../javascript/print_schema";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEvaMonth } from "../../summary_score/actions/summary_scoreSlice";

const GradingTable = ({evaResult}) => {
  const dispatch = useDispatch();
  //state
  const summaryScore = useSelector((state) => state.summary_score);
  const convertToThaiBuddhistDate = (gregorianDate) => {
    let [year, month] = gregorianDate.split("-");

    // Convert year from string to integer
    year = parseInt(year, 10);

    // Thai Buddhist calendar is 543 years ahead of the Gregorian calendar
    let thaiYear = year + 543;

    // Return the Thai Buddhist date in the format YYYY-MM
    return `${thaiYear}-${month}`;
  };
  console.log(convertToThaiBuddhistDate(summaryScore.filter_eva_month));
  return (
    <>
      <div className="my-10">
        <div class="overflow-x-auto">
          <table class="sm:w-auto md:w-full border-collapse">
            <tbody>
              <tr class="bg-[#006254]">
                <td class="px-4 py-2" colspan="3">
                  <h1 class="text-center font-bold text-lg text-white">
                    เกณฑ์การให้คะแนน
                  </h1>
                </td>
              </tr>
              <tr>
                <td class="px-4 py-2 sm:w-1/3 text-center">เกรด</td>
                <td class="px-4 py-2 sm:w-1/4">
                  <center>คะแนน (%)</center>
                </td>
                <td class="px-4 py-2 sm:w-2/5 text-center">ผลสรุป</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-center">A</td>
                <td class="px-4 py-2 text-center">90-100</td>
                <td class="px-4 py-2 text-center">ดีมาก</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-center">B</td>
                <td class="px-4 py-2 text-center">80-89</td>
                <td class="px-4 py-2 text-center">ดี</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-center">C</td>
                <td class="px-4 py-2 text-center">70-79</td>
                <td class="px-4 py-2 text-center">พอใช้</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-center">D</td>
                <td class="px-4 py-2 text-center">น้อยกว่า 69</td>
                <td class="px-4 py-2 text-center">ปรับปรุง</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <DatePicker
        onChange={(date, dateString) => dispatch(setEvaMonth(dateString))}
        picker="month"
      />
      <br/>
      <div className="mt-[10px]">
      <Table
        dataSource={evaResult}
        columns={schema(evaResult)}
        pagination={false}
      />
      </div>
    </>
  );
};
export default memo(GradingTable);
