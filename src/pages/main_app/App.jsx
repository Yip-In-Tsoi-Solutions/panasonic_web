import React, { lazy, useState } from "react";
import { Layout, theme } from "antd";
const Navigation = lazy(() => import("../../components/navigation/components"));
const Supplier_delivery = lazy(() => import("../supplier_delivery/components"));
const Buyer_Reason = lazy(() => import("../buyer_reason/components"));
const PriceReport = lazy(() => import("../price_report/components"));
const Evaluate_form = lazy(() => import("../evaluate_form/components"));
const Original_delivery = lazy(() => import("../original_delivery/components"));
const PowerBi_report_list = lazy(() =>
  import("../powerbi_report/components/report_list")
);
const PowerBi_reportAdmin = lazy(() =>
  import("../powerbi_report/components/add_report")
);
const { Content } = Layout;
const App = () => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  // original report
  const logo = "src/assets/Panasonic_ENERGY_Logo.jpg";
  const [selected_items, setSelected] = useState(1);
  return (
    <Layout>
      <Navigation logo={logo} setSelected={setSelected} />
      <Layout>
        <div>
          <Content
            className="p-10 m-[24px 16px] h-screen"
            style={{
              backgroundColor: "white",
              borderRadius: borderRadiusLG,
            }}
          >
            {selected_items === 1 && <Original_delivery />}
            {selected_items === 2 && <Supplier_delivery />}
            {selected_items === 3 && <Buyer_Reason />}
            {selected_items === 4 && <PriceReport />}
            {selected_items === 5 && <Evaluate_form />}
            {selected_items === 6 && <PowerBi_report_list />}
            {selected_items === 7 && <PowerBi_reportAdmin />}
          </Content>
        </div>
      </Layout>
    </Layout>
  );
};
export default App;
