import { Menu } from "antd";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { UserOutlined, GlobalOutlined } from "@ant-design/icons";
import { clearUserInfo } from "../../store/userDataSlice";
import { clearNote } from "../../store/noteDataSlice";
import { useNavigate } from "react-router-dom";
const MainHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.userDataSlice.userInfo);
  console.log(userInfo);
  const { t } = useTranslation();
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
  const onMenu = (e: any) => {
    if (e.key === "menuLanEn") {
      i18n.changeLanguage("en");
    }
    if (e.key === "menuLanZh") {
      i18n.changeLanguage("zh");
    }
    if (e.key === "menuSignOut") {
      localStorage.removeItem("lifecapsule3_token");
      dispatch(clearUserInfo());
      dispatch(clearNote());
      navigate("/guest/login");
    }
  };

  return (
    <Menu
      style={{
        width: "100%",
        justifyContent: "flex-end",
        background: themeColor.background,
        color: themeColor.textLight,
        border: `1px solid ${themeColor.background}`,
      }}
      theme="dark"
      mode="horizontal"
      items={[
        {
          key: "2",
          icon: <UserOutlined />,
          label: userInfo.nickname ? userInfo.nickname : userInfo.loginName,
          children: [
            {
              key: "menuSignOut",
              label: t("nav.signOut"),
            },
          ],
        },
        {
          key: "1",
          label: t("nav.language"),
          icon: <GlobalOutlined />,
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
  );
};
export default MainHeader;
