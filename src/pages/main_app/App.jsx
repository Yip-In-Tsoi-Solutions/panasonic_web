import React, { useState } from "react";
import { Layout, theme } from "antd";
import Navigation from "../../components/navigation/components";
import Supplier_delivery from "../supplier_delivery/components";
import Buyer_Reason from "../buyer_reason/components";
import PriceReport from "../price_report/components";
import PowerBi_report from "../powerbi_report/components";
import Evaluate_form from "../evaluate_form/components";
import Original_delivery from "../original_delivery/components";
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
            {selected_items === 1 ? (
              <Original_delivery />
            ) : selected_items === 2 ? (
              <Supplier_delivery />
            ) : selected_items === 3 ? (
              <Buyer_Reason />
            ) : selected_items === 4 ? (
              <PriceReport />
            ) : selected_items === 5 ? (
              <PowerBi_report />
            ) : selected_items === 6 ? (
              <Evaluate_form />
            ) : (
              ""
            )}
          </Content>
        </div>
      </Layout>
    </Layout>
  );
};
export default App;
