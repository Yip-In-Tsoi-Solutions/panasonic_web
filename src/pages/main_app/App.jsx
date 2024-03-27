import React, { useMemo, useState } from "react";
import { Layout, Button, theme } from "antd";
import Navigation from "../../components/navigation/components";
import SearchWithIcon from "../../components/search_with_icon/components";
import axios from "axios";
import Supplier_delivery from "../supplier_delivery/components";
const { Header, Content } = Layout;
const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const logo = "src/assets/Panasonic_ENERGY_Logo.jpg";
  const [selected_items, setSelected] = useState(1);
  console.log(selected_items);
  return (
    <Layout>
      <Navigation logo={logo} setSelected={setSelected} />
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div className="flex p-10 pt-[20px]">
            <SearchWithIcon />
            <Button
              type="button"
              className="w-[160px] h-10 mt-5 bg-[#006254] text-[white] font-bold uppercase"
            >
              Add Supplier +
            </Button>
          </div>
        </Header>
        <div className="clear-both">
          <Content
            className="p-10 h-screen m-[24px 16px]"
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {selected_items === 1 ? <Supplier_delivery /> : ""}
          </Content>
        </div>
      </Layout>
    </Layout>
  );
};
export default App;
