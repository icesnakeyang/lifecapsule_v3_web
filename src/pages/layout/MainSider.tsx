import { Menu } from "antd";
import {
  AppstoreOutlined,
  CheckSquareOutlined,
  DashboardOutlined,
  ReadOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const MainSider = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);

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
    if (e.key === "menuTaskTodoList") {
      navigate("/main/TodoPage");
    }
    if (e.key === "menuCreativeNote") {
      navigate("/main/CreativeNoteList");
    }
    if (e.key === "menuQuadrantTaskList") {
      navigate("/main/QuadrantTaskList");
    }
    if (e.key === "menuThemeSetting") {
      navigate("/main/ThemeSetting");
    }
  };
  return (
    <Menu
      style={{ background: themeColor.background, color: themeColor.textLight }}
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
          label: t("nav.myNote"),
        },
        {
          key: "menuCreativeNote",
          icon: <ReadOutlined />,
          label: t("nav.creativeNote"),
        },
        {
          key: "menuContact",
          icon: <TeamOutlined />,
          label: t("nav.contact"),
        },
        {
          key: "menuTaskTodoList",
          icon: <CheckSquareOutlined />,
          label: t("nav.taskTodo"),
        },
        {
          key: "menuQuadrantTaskList",
          icon: <AppstoreOutlined />,
          label: t("nav.myQuadTask"),
        },
        {
          key: "menuThemeSetting",
          icon: <SettingOutlined />,
          label: t("nav.setting"),
        },
      ]}
      onClick={(e) => {
        onMenu(e);
      }}
    />
  );
};

export default MainSider;
