import { Button, Typography } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  apiListTheme,
  apiLoadMyNoteSendStatistic,
  apiSignInByNothing,
  apiSignToken,
} from "../api/Api";
import { saveCurrentThemeId, saveThemeColor } from "../store/themeSlice";
import { saveUserData } from "../store/userDataSlice";
import { saveNoteCategoryCurrent } from "../store/noteDataSlice";
import {
  saveTotalReceiveNote,
  saveTotalReceiveNoteUnread,
  saveTotalSendNote,
  saveTotalSendNoteUnread,
} from "../store/noteSendSlice";

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userData = useSelector((state: any) => state.userDataSlice);
  const themeId = useSelector((state: any) => state.themeSlice.currentThemeId);
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
  const dispatch = useDispatch();
  const currentCategoryId = useSelector(
    (state: any) => state.noteDataSlice.currentCategoryId
  );

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
      /**
       * 如果没有token，就注册一个新用户
       */
      // navigate("/guest/login");
      apiSignInByNothing().then((res: any) => {
        if (res.code === 0) {
          dispatch(saveUserData(res.data));
          let data = {
            categoryId: res.data.defaultCategoryId,
            categoryName: res.data.defaultCategoryName,
          };
          dispatch(saveNoteCategoryCurrent(data));
          localStorage.setItem("lifecapsule3_token", res.data.token);
          navigate("/main/dashboard");
        }
      });
    } else {
      apiSignToken().then((res: any) => {
        console.log(res)
        if (res.code === 0) {
          let data = {
            token: res.data.user.token,
            nickname: res.data.user.nickname,
            userStatus: res.data.user.userStatus,
            timerPrimary: res.data.timerPrimary,
          };
          dispatch(saveUserData(data));
          if (!currentCategoryId) {
            let noteCategory = {
              currentCategoryId: res.data.user.defaultCategoryId,
              currentCategoryName: res.data.user.defaultCategoryName,
            };
            dispatch(saveNoteCategoryCurrent(noteCategory));
          }

          apiLoadMyNoteSendStatistic({}).then((res: any) => {
            if (res.code === 0) {
              dispatch(saveTotalReceiveNote(res.data.totalReceive));
              dispatch(saveTotalReceiveNoteUnread(res.data.totalReceiveUnread));
              dispatch(saveTotalSendNote(res.data.totalSend));
              dispatch(saveTotalSendNoteUnread(res.data.totalSendUnread));
            }
          });
          navigate("/main/dashboard");
        } else {
          navigate("/guest/LoginByEmail")
        }
      });
    }
  };

  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: themeColor ? themeColor.background : "white",
        // background: themeColor.background?themeColor.background:'black',
      }}
    >
      <Typography.Title
        style={{ color: themeColor ? themeColor.textLight : "#333" }}
      >
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
