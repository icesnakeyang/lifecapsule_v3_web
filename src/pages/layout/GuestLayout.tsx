import { Button, Layout, Menu } from "antd";
import { Outlet } from "react-router-dom";
import FooterBar from "./FooterBar";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

const { Header, Content, Footer } = Layout;

const GuestLayout = () => {
  const { t } = useTranslation();
  const onMenu = (e: any) => {
    if (e.key === "menuLanZh") {
      i18n.changeLanguage("zh");
    }
    if (e.key === "menuLanEn") {
      i18n.changeLanguage("en");
    }
  };
  return (
    <Layout style={{ height: "100vh", background: "#ccc" }}>
      <Header>
        <Menu
          style={{ width: "100%", justifyContent: "flex-end" }}
          theme="dark"
          mode="horizontal"
          items={[
            {
              key: "1",
              label: t("nav.language"),
              children: [
                { label: "中文", key: "menuLanZh" },
                {
                  label: "English",
                  key: "menuLanEn",
                },
              ],
            },
          ]}
          onClick={(e) => {
            onMenu(e);
          }}
        />
      </Header>
      <Content>
        <Outlet />
      </Content>
      <Footer>
        <FooterBar />
      </Footer>
    </Layout>
  );
};

export default GuestLayout;
