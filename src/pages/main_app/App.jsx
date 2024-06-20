import React, { lazy, useMemo, useState } from "react";
import { ConfigProvider, Layout, theme } from "antd";
const Navigation = lazy(() => import("../../components/navigation/components"));
const Supplier_delivery = lazy(() => import("../supplier_delivery/components"));
const Buyer_Reason = lazy(() => import("../buyer_reason/components"));
const PriceReport = lazy(() => import("../price_report/components"));
const GoodsReturn = lazy(() => import("../goods_return/components"));
const Evaluate = lazy(() => import("../evaluate_form/components"));
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
  const logo = "/Panasonic_ENERGY_Logo.jpg";
  const [selected_items, setSelected] = useState('1');
  const url =
    window.location.protocol + "//" + window.location.hostname + ":9000";
  const token_id = sessionStorage.getItem("token_session");
  useMemo(()=> {
    setSelected(parseInt(sessionStorage.getItem('pageId')))
  }, [selected_items])
  return (
    <Layout>
      <Navigation logo={logo} setSelected={setSelected} />
      <Layout>
        <ConfigProvider
          theme={{
            token: {
              fontSize: 12,
            },
          }}
        >
          <Content
            className="p-10 m-[24px 16px] h-screen"
            style={{
              backgroundColor: "white",
              borderRadius: borderRadiusLG,
            }}
          >
            {selected_items === 1 && (
              <Original_delivery
                token_id={token_id}
                page_title={"Original_delivery".toUpperCase()}
                baseUrl={url}
              />
            )}
            {selected_items === 2 && (
              <Supplier_delivery
                token_id={token_id}
                page_title={"Supplier_delivery".toUpperCase()}
                baseUrl={url}
              />
            )}
            {selected_items === 3 && (
              <Buyer_Reason
                token_id={token_id}
                page_title={"Buyer_Reason".toUpperCase()}
                baseUrl={url}
              />
            )}
            {selected_items === 4 && (
              <PriceReport
                token_id={token_id}
                page_title={"PriceReport".toUpperCase()}
                baseUrl={url}
              />
            )}
            {selected_items === 5 && (
              <GoodsReturn
                token_id={token_id}
                page_title={"Goods Return".toUpperCase()}
                baseUrl={url}
              />
            )}
            {selected_items === 6 && (
              <Evaluate
                token_id={token_id}
                page_title={"Evaluate_form".toUpperCase()}
                baseUrl={url}
              />
            )}
            {selected_items === 7 && (
              <PowerBi_report_list
                token_id={token_id}
                page_title={"PowerBi_report_list".toUpperCase()}
                baseUrl={url}
              />
            )}
            {selected_items === 8 && (
              <PowerBi_reportAdmin
                token_id={token_id}
                page_title={"PowerBi_reportAdmin".toUpperCase()}
                baseUrl={url}
              />
            )}
          </Content>
        </ConfigProvider>
      </Layout>
    </Layout>
  );
};
export default App;
