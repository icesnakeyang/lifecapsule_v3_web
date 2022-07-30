import { Breadcrumb } from "antd";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
  const { t } = useTranslation();
  return (
    <div>
      <Breadcrumb style={{ margin: "20px 0" }}>
        <Breadcrumb.Item>
          <span style={{ color: themeColor.textLight }}>{t("nav.home")}</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/main/dashboard" style={{ color: themeColor.textLight }}>
            {t("nav.dashboard")}
          </a>
        </Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
};

export default Dashboard;
