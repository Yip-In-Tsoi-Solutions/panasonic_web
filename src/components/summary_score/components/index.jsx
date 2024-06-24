import { memo } from "react";
import GradingTable from "../../../components/grading/components/grading";
const SummaryScore = ({ evaResult }) => {
  return (
    <>
      <GradingTable evaResult={evaResult} />
    </>
  );
};
export default memo(SummaryScore);
