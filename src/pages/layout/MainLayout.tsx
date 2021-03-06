import { Col, Layout, Menu, Row, Typography } from "antd";
import { Outlet } from "react-router-dom";
import FooterBar from "./FooterBar";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { WalletOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Sider from "antd/lib/layout/Sider";
import MainSider from "./MainSider";
import MainHeader from "./MainHeader";
import { useSelector } from "react-redux";

const { Header, Content, Footer } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.token);
  const userInfo = useSelector((state: any) => state.userInfo);

  useEffect(() => {
    return () => {};
  }, [token]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "fixed",
          width: "100%",
          justifyContent: "space-around",
          padding: 0,
          zIndex: 1000,
        }}
      >
        <Row
          style={{
            width: "100%",
            alignItems: "center",
          }}
        >
          <Col
            xs={6}
            sm={6}
            md={6}
            lg={4}
            xl={4}
            style={{
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              margin: 0,
              padding: 0,
              width: "100%",
            }}
          >
            {collapsed ? (
              <WalletOutlined
                style={{ fontSize: "28px", color: "#eee" }}
                onClick={() => {}}
              />
            ) : (
              <Typography.Title
                level={4}
                style={{ margin: 0, color: "#eee", cursor: "pointer" }}
                onClick={() => {
                  navigate("/dashboard", { state: { pp: 1 } });
                }}
              >
                {t("common.appTitle")}
              </Typography.Title>
            )}
          </Col>
          <Col
            xs={18}
            sm={18}
            md={18}
            lg={20}
            xl={20}
            style={{
              width: "100%",
            }}
          >
            <MainHeader />
          </Col>
        </Row>
      </Header>
      <Layout
        style={{
          marginTop: "70px",
          height: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Sider
          style={{}}
          breakpoint="md"
          onBreakpoint={(e) => {
            setCollapsed(e);
          }}
        >
          <MainSider />
        </Sider>
        <Content style={{ margin: 10, padding: 20 }}>
          <Outlet />
        </Content>
      </Layout>
      <Footer>
        <FooterBar />
      </Footer>
    </Layout>
  );
};

export default MainLayout;
