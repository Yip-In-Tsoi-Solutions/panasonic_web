import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Button, theme, Input, Form } from "antd";
import Navigation from "../components/navigation";
const { Header, Content } = Layout;
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Navigation />
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div className="flex p-10 pt-[20px]">
            <Input className="w-full h-10 mt-5 mr-5" placeholder="Search" />
            <Button type="button" className="w-[160px] h-10 mt-5 bg-[#006254] text-[white] font-bold uppercase">
              Add Supplier +
            </Button>
            {/* <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: 16,
                width: 64,
                height: 64,
              }}
            /> */}
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
            Content
          </Content>
        </div>
      </Layout>
    </Layout>
  );
};
export default App;
