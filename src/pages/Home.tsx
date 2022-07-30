import { Button, Typography } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiListTheme, apiSignToken } from "../api/Api";
import { saveCurrentThemeId, saveThemeColor } from "../store/themeSlice";
const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userData = useSelector((state: any) => state.userDataSlice);
  const themeId = useSelector((state: any) => state.themeSlice.currentThemeId);
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
  const dispatch = useDispatch();

  useEffect(() => {
    if (themeId) {
      apiListTheme({})
        .then((res: any) => {
          if (res.code === 0) {
            dispatch(saveThemeColor(res.data.themeList[0]));
            dispatch(saveCurrentThemeId(res.data.themeList[0].themeId));
          }
        })
        .catch((e) => {});
    } else {
      apiListTheme({}).then((res: any) => {
        if (res.code === 0) {
          dispatch(saveThemeColor(res.data.themeList[1]));
          dispatch(saveCurrentThemeId(res.data.themeList[1].themeId));
        }
      });
    }
  }, []);

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
        background: themeColor.background,
      }}
    >
      <Typography.Title style={{ color: themeColor.textLight }}>
        {t("common.appTitle")}
      </Typography.Title>
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
