import { Badge, Menu } from "antd";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { UserOutlined, GlobalOutlined, MailOutlined } from "@ant-design/icons";
import { clearUserData } from "../../store/userDataSlice";
import { clearNote } from "../../store/noteDataSlice";
import { useNavigate } from "react-router-dom";

const MainHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.userDataSlice) || null;
  const { t } = useTranslation();
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);

  const totalReceiveNoteUnread = useSelector(
    (state: any) => state.noteSendSlice.totalReceiveNoteUnread
  );

  const onMenu = (e: any) => {
    if (e.key === "menuLanEn") {
      i18n.changeLanguage("en");
    }
    if (e.key === "menuLanZh") {
      i18n.changeLanguage("zh");
    }
    if (e.key === "menuSignOut") {
      localStorage.removeItem("lifecapsule3_token");
      dispatch(clearUserData());
      dispatch(clearNote());
      navigate("/");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
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
            label: userData.nickname ? userData.nickname : userData.loginName,
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
      {totalReceiveNoteUnread ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: 40,
          }}
        >
          <a
            onClick={() => {
              navigate("/main/MyReceiveNote");
            }}
          >
            <Badge count={totalReceiveNoteUnread} size="small" offset={[5, -5]}>
              <MailOutlined style={{ color: themeColor.textLight }} />
            </Badge>
          </a>
        </div>
      ) : null}
    </div>
  );
};
export default MainHeader;
