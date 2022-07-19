import { Menu } from "antd";
import {
  DashboardOutlined,
  ReadOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
const MainSider = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onMenu = (e: any) => {
    if (e.key === "menuDashboard") {
      navigate("/main/dashboard");
    }
    if (e.key === "menuNote") {
      navigate("/main/noteList");
    }
    if (e.key === "menuContact") {
      navigate("/main/contactList");
    }
  };
  return (
    <Menu
      theme="dark"
      mode="inline"
      items={[
        {
          key: "menuDashboard",
          icon: <DashboardOutlined />,
          label: t("nav.dashboard"),
        },
        {
          key: "menuNote",
          icon: <ReadOutlined />,
          label: t("nav.note"),
        },
        {
          key: "menuContact",
          icon: <TeamOutlined />,
          label: t("nav.contact"),
        },
      ]}
      onClick={(e) => {
        onMenu(e);
      }}
    />
  );
};

export default MainSider;
