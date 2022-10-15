import {Button,  Carousel, Col, Row} from "antd";
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
import {
  saveTotalReceiveNote,
  saveTotalReceiveNoteUnread,
  saveTotalSendNote,
  saveTotalSendNoteUnread,
} from "../store/noteSendSlice";
import banner1 from "../resources/aser-min.jpg"

const contentStyle: React.CSSProperties = {
  height: '360px',
  color: '#912929',
  lineHeight: '360px',
  textAlign: 'center',
  background: '#fff',
};

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userData = useSelector((state: any) => state.userDataSlice);
  const themeId = useSelector((state: any) => state.themeSlice.currentThemeId);
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
      /**
       * 如果没有token，就注册一个新用户
       */
      // navigate("/guest/login");
      apiSignInByNothing().then((res: any) => {
        if (res.code === 0) {
          dispatch(saveUserData(res.data));
          localStorage.setItem("lifecapsule3_token", res.data.token);
          navigate("/main/dashboard");
        }
      });
    } else {
      apiSignToken().then((res: any) => {
        if (res.code === 0) {
          let data = {
            token: res.data.user.token,
            nickname: res.data.user.nickname,
            userStatus: res.data.user.userStatus,
            timerPrimary: res.data.timerPrimary,
          };
          dispatch(saveUserData(data));

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

      }}
    >
      <Carousel autoplay>
        <div>
          <h3 style={contentStyle}>
            <img src={banner1} width="100%"/>
          </h3>
        </div>
      </Carousel>

      <Row style={{position:'absolute', top:0, left:0}}>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <div style={{background:'#1a12c3'}}>
            <div style={{color:'#fff', fontSize:24}}>
            {t("webSite.home.tip1")}
          </div>
            <div style={{color:'#fff', fontSize:14}}>
              {t("webSite.home.tip2")}
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
          <div>
            <div style={{background:'#333675'}}>
              <div style={{color:'#fff', fontSize:24}}>
                {t("webSite.home.tip7")}
              </div>
              <div style={{color:'#fff', fontSize:14}}>
                {t("webSite.home.tip3")}
              </div>
              <div style={{color:'#fff', fontSize:14}}>
                {t("webSite.home.tip4")}
              </div>
              <div style={{color:'#fff', fontSize:14}}>
                {t("webSite.home.tip5")}
              </div>
              <div style={{color:'#fff', fontSize:14}}>
                {t("webSite.home.tip6")}
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <div style={{background:"red", display:"flex", justifyContent:'space-around',marginTop:20}}>
        <div style={{background:'#1a12c3', padding:20, width:360,height:260, top:200,left:100, position:'absolute'}}>


        </div>


      </div>


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
