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
import banner1 from "../resources/bg2.jpg"

const contentStyle: React.CSSProperties = {
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
        <div>
            <div
                style={{height: '80vh'}}
            >
                <div style={{}}>
                    <img src={banner1} width="100%"/>
                </div>

                <Row style={{marginTop: 20}}>
                    <Col span={12} style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        display: 'flex'
                    }}>
                        <div
                            style={{
                                width: 450,
                                padding: 20,
                                background: '#333675',
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex'
                            }}>
                            <div style={{}}>
                                <div style={{color: '#fff', fontSize: 24}}>
                                    {t("webSite.home.tip1")}
                                </div>
                                <div style={{color: '#fff', fontSize: 14, marginTop: 20}}>
                                    {t("webSite.home.tip2")}
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col span={12} style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        display: 'flex'
                    }}>
                        <div style={{width: 450, padding: 20, background: '#333675'}}>
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
                    </Col>
                </Row>

                <div style={{
                    marginTop: 50, alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex'
                }}>
                    <Button
                        style={{background: '#333675', borderColor: '#333333',fontSize:18}}
                        type="primary"
                        onClick={() => {
                            onSignIn();
                        }}
                        size='large'
                    >
                        Free To Try
                    </Button>
                </div>
            </div>
            <div style={{
                height: '20vh',
                background: '#ccc',
                display: 'flex',
                justifyContent: 'center',
                alignItems: "center"
            }}>
                <div style={{}}>
                    <a href="/user_privacy" style={{fontSize:20}}>User Private Policy</a>
                </div>
                <div style={{marginLeft: 100}}>
                    <a href="" style={{fontSize:20}}>Copyright © GOGOYANG DATATECH LIMIT</a>
                </div>
            </div>
        </div>
    );
};

export default Home;
