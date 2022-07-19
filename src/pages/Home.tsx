import { Button, Typography } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiSignToken } from "../api/Api";
const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userData = useSelector((state: any) => state.userDataSlice);

  const onSignIn = () => {
    if (!userData.token) {
      navigate("/guest/login");
    }
    apiSignToken().then((res: any) => {
      if (res.code === 0) {
        navigate("/main/dashboard");
      } else {
        navigate("/guest/login");
      }
    });
  };

  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Typography.Title>{t("common.appTitle")}</Typography.Title>
      <Button
        type="primary"
        onClick={() => {
          onSignIn();
        }}
      >
        {t("login.btSignIn")}
      </Button>
    </div>
  );
};

export default Home;
