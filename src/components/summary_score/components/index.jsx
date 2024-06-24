import { memo } from "react";
import GradingTable from "../../../components/grading/components/grading";
const SummaryScore = ({ baseUrl, token_id }) => {
  return (
    <>
      <GradingTable baseUrl={baseUrl} token_id={token_id} />
    </>
  );
};
export default memo(SummaryScore);
