import {Button, Carousel, Col, Row} from "antd";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {
    apiListTheme,
    apiLoadMyNoteSendStatistic,
    apiSignInByNothing,
    apiSignToken,
} from "../api/Api";
import {saveCurrentThemeId, saveThemeColor} from "../store/themeSlice";
import {saveUserData} from "../store/userDataSlice";
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
    const {t} = useTranslation();
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
                .catch((e) => {
                });
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
            style={{}}
        >
            <Carousel autoplay>
                <div>
                    <h3 style={contentStyle}>
                        <img src={banner1} width="100%"/>
                    </h3>
                </div>
            </Carousel>

            <div>
                <div
                    style={{position: 'absolute', top: 120, left: 100, width: 340, padding: 20, background: '#333675'}}>
                    <div style={{}}>
                        <div style={{color: '#fff', fontSize: 24}}>
                            {t("webSite.home.tip1")}
                        </div>
                        <div style={{color: '#fff', fontSize: 14, marginTop: 20}}>
                            {t("webSite.home.tip2")}
                        </div>
                    </div>
                </div>

                <div style={{position: 'absolute', top: 280, left: 550, padding: 20, background: '#333675'}}>
                    <div>
                        <div style={{}}>
                            <div style={{color: '#fff', fontSize: 24}}>
                                {t("webSite.home.tip8")}
                            </div>
                            <div style={{color: '#fff', fontSize: 14, marginTop: 20}}>
                                {t("webSite.home.tip3")}
                            </div>
                            <div style={{color: '#fff', fontSize: 14}}>
                                {t("webSite.home.tip4")}
                            </div>
                            <div style={{color: '#fff', fontSize: 14}}>
                                {t("webSite.home.tip5")}
                            </div>
                            <div style={{color: '#fff', fontSize: 14}}>
                                {t("webSite.home.tip6")}
                            </div>
                            <div style={{color: '#fff', fontSize: 14}}>
                                {t("webSite.home.tip7")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{marginTop: 50, marginLeft: 220}}>
                <Button
                    style={{background: '#333675', borderColor: '#333333'}}
                    type="primary"
                    onClick={() => {
                        onSignIn();
                    }}
                    size='large'
                >
                    Free To Try
                </Button>
            </div>
            <div style={{
                background: '#ddd',
                marginTop: 100,
                height: 200,
                display: 'flex',
                justifyContent: 'center',
                alignItems: "center"
            }}>
                <div style={{margin:50}}>
                    <a href="/user_privacy">User Private Policy</a>
                </div>
                <div style={{margin:50}}>
                    <a href="">Copyright © GOGOYANG DATATECH LIMIT</a>
                </div>
            </div>
        </div>
    );
};

export default Home;
