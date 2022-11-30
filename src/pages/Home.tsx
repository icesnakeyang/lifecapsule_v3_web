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
    // height: '360px',
    height: '550px',
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
            console.log('no token')
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
            console.log('has token')
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
            style={{height: '100vh'}}
        >
            <div style={{}}>
                <Carousel autoplay>
                    <div>
                        <h3 style={contentStyle}>
                            <img src={banner1} width="100%"/>
                        </h3>
                    </div>
                </Carousel>
            </div>

            <div style={{
                position: "absolute",
                top: '20%',
                left: '10%'
            }}>
                <div
                    style={{
                        width: 500,
                        padding: 20,
                        background: '#333675'
                    }}>
                    <div style={{}}>
                        <div style={{color: '#fff', fontSize: 42}}>
                            {t("webSite.home.tip1")}
                        </div>
                        <div style={{color: '#fff', fontSize: 20, marginTop: 20}}>
                            {t("webSite.home.tip2")}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{position: 'absolute', top: '30%', left: '50%', padding: 20, background: '#333675'}}>
                <div style={{width: 600}}>
                    <div style={{color: '#fff', fontSize: 42}}>
                        {t("webSite.home.tip8")}
                    </div>
                    <div style={{color: '#fff', fontSize: 20, marginTop: 20}}>
                        {t("webSite.home.tip3")}
                    </div>
                    <div style={{color: '#fff', fontSize: 20, marginTop: 20}}>
                        {t("webSite.home.tip4")}
                    </div>
                    <div style={{color: '#fff', fontSize: 20, marginTop: 20}}>
                        {t("webSite.home.tip5")}
                    </div>
                    <div style={{color: '#fff', fontSize: 20, marginTop: 20}}>
                        {t("webSite.home.tip6")}
                    </div>
                    <div style={{color: '#fff', fontSize: 20, marginTop: 20}}>
                        {t("webSite.home.tip7")}
                    </div>
                </div>
            </div>

            <div style={{marginTop: 50, marginLeft: 400}}>
                <Button
                    style={{background: '#333675', borderColor: '#333333', width: 200, height: 60, fontSize: 24}}
                    type="primary"
                    onClick={() => {
                        onSignIn();
                    }}
                    size='large'
                >
                    Free To Try
                </Button>
            </div>

            <div>
                {/*<h3>Embed YouTube video - <a href="https://www.cluemediator.com">Clue Mediator</a></h3>*/}
                {/*<ReactPlayer*/}
                {/*    url="https://www.youtube.com/watch?v=UVCP4bKy9Iw"*/}
                {/*/>*/}
            </div>

            <div style={{
                position: "fixed",
                bottom: 0,
                background: '#ccc',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-around'
            }}>
                <div style={{margin: 50, fontSize: 20}}>
                    <a href="/user_privacy">User Private Policy</a>
                </div>
                <div style={{margin: 50, fontSize: 20}}>
                    Contact us: support@tellmeafter.com
                </div>
                <div style={{margin: 50, fontSize: 20}}>
                    <a href="">Copyright © GOGOYANG DATATECH LIMIT</a>
                </div>
            </div>
        </div>
    )
        ;
};

export default Home;
