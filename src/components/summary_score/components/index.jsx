import { memo } from "react";
import GradingTable from "../../../components/grading/components/grading";
const SummaryScore = ({ baseUrl, token_id, exportSummaryPDF }) => {
  return (
    <>
      <GradingTable baseUrl={baseUrl} token_id={token_id} exportSummaryPDF={exportSummaryPDF} />
    </>
  );
};
export default memo(SummaryScore);
