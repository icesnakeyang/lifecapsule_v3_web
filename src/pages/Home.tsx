import {Button, Carousel, Col, Menu, MenuProps, Row} from "antd";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {
    apiListTheme,
    apiLoadMyNoteSendStatistic, apiSaveUserLanguage,
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
import {GlobalOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";
import i18n from "i18next";
import {saveLanguage} from "../store/commonSlice";

const Home = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const userData = useSelector((state: any) => state.userDataSlice);
    const themeId = useSelector((state: any) => state.themeSlice.currentThemeId);
    const dispatch = useDispatch();
    const language = useSelector((state: any) => state.commonSlice.language)
    const lan = i18n.language

    useEffect(() => {
        if (!language) {
            i18n.changeLanguage('en')
            dispatch(saveLanguage("en"))
            apiSaveUserLanguage({language: "en"})
        } else {
            i18n.changeLanguage(language)
            dispatch(saveLanguage(language))
            apiSaveUserLanguage({language: language})
        }

    }, [language])

    const headerMenuItemsUnSign: MenuProps['items'] = [
        {
            label: lan === 'zh' ? '中文' : 'Language',
            // label: 'Navigation Three - Submenu',
            key: 'language',
            icon: <GlobalOutlined/>,
            children: [
                {
                    label: 'English',
                    key: 'menuEnglish'
                },
                {
                    label: '中文',
                    key: 'menuChinese'
                }
            ]
        }
    ]

    const headerMenuItemsSigned: MenuProps['items'] = [
        {
            label: userData.nickname,
            key: 'signout',
            icon: <UserOutlined/>,
            children: [
                {
                    label: 'Sign out',
                    icon: <MailOutlined/>,
                    key: 'menuSignOut'
                }
            ]
        },
        {
            label: lan === 'zh' ? '中文' : 'Language',
            // label: 'Navigation Three - Submenu',
            key: 'language',
            icon: <GlobalOutlined/>,
            children: [
                {
                    label: 'English',
                    key: 'menuEnglish'
                },
                {
                    label: '中文',
                    key: 'menuChinese'
                }
            ]
        }
    ]

    const onMenuHeader: MenuProps['onClick'] = (e) => {
        if (e.key === 'menuEnglish') {
            i18n.changeLanguage("en");
            dispatch(saveLanguage("en"))
            apiSaveUserLanguage({language: "en"})
        }
        if (e.key === 'menuChinese') {
            i18n.changeLanguage("zh");
            dispatch(saveLanguage("zh"))
            apiSaveUserLanguage({language: "zh"})
        }
        if (e.key === 'menuLogin') {
        }
        if (e.key === 'menuSignOut') {
        }
    }

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
                    navigate("/guest/LoginPage")
                }
            });
        }
    };

    return (
        <div
            style={{}}
        >
            {/*header*/}
            <div style={{padding: 10}}>
                <Row style={{width: '100%', display: 'flex', alignItems: 'center'}}>
                    <Col xs={12} sm={8} md={8} lg={4} xl={4} xxl={4}>
                        {/*logo*/}
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <div style={{}}>
                                <img src="/logo5.png" width='42px'/>
                            </div>
                            <div style={{marginLeft: 20, fontSize: 20, fontWeight: 'bold'}}>
                                {t('common.appTitle')}
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} sm={16} md={16} lg={20} xl={20} xxl={20}>
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            background: 'green'
                        }}>
                            {userData && userData.nickname ?
                                <Menu style={{width: '100%', justifyContent: 'flex-end', borderWidth: 0}}
                                      items={headerMenuItemsSigned}
                                      mode="horizontal"
                                      onClick={onMenuHeader}
                                />
                                :
                                <Menu style={{width: '100%', justifyContent: 'flex-end', borderWidth: 0}}
                                      items={headerMenuItemsUnSign}
                                      mode="horizontal" onClick={onMenuHeader}/>
                            }
                        </div>
                    </Col>
                </Row>
            </div>

            {/*banner*/}
            <div style={{}}>
                <Carousel autoplay style={{
                    height: 450
                }}>
                    <div>
                        <img src='/ban5.jpg' width='100%' height='450px'/>
                    </div>
                    <div>
                        <img src='/aser-min.jpg' width='100%' height='450px'/>
                    </div>
                    <div>
                        <img src='/ban3.webp' width='100%' height='450px'/>
                    </div>
                    <div>
                        <img src='/ban4.webp' width='100%' height='450px'/>
                    </div>
                </Carousel>
            </div>

            {/*Sign button*/}
            <div style={{marginTop: 40, textAlign: 'center'}}>
                <Button
                    style={{background: '#333675', borderColor: '#333333', width: 200, height: 60, fontSize: 24}}
                    type="primary"
                    onClick={() => {
                        onSignIn();
                    }}
                    size='large'
                >
                    Start Now
                </Button>
            </div>

            {/*private note, Encrypt Share, deep social*/}
            <Row style={{marginTop: 20, padding: 20}}>
                <Col style={{
                    justifyContent: 'center',
                    display: 'flex',
                    // background: '#ff0080',
                    flexDirection: "column",
                    alignItems: "center"
                }} xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                    <div style={{padding: 10, height: '100%', maxWidth: 550, background: '#ff0080',}}>
                        <div style={{
                            color: '#fff',
                            fontSize: 28,

                            height: 50,
                            textAlign: "center",
                            alignItems: 'center',
                            justifyContent: 'center',
                            display: 'flex'
                        }}>
                            {t("webSite.home.privateNote")}
                        </div>
                        <div style={{marginTop: 0}}>
                            <img src='/notebook.jpeg' width='100%'/>
                        </div>
                        <div>
                            <div style={{color: '#fff', fontSize: 14, marginTop: 20, lineHeight: 2}}>
                                {t("webSite.home.privateNote1")}
                            </div>
                            <div style={{color: '#fff', fontSize: 14, marginTop: 20, lineHeight: 2}}>
                                {t("webSite.home.privateNote2")}
                            </div>
                        </div>
                    </div>
                </Col>
                <Col style={{
                    // background: '#008040',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }} xs={24} sm={24} md={8}
                     lg={8} xl={8} xxl={8}>
                    <div style={{padding: 10, height: '100%', maxWidth: 550, background: '#008040',}}>
                        <div style={{
                            color: '#fff',
                            fontSize: 28,

                            height: 50,
                            textAlign: "center",
                            alignItems: 'center',
                            justifyContent: 'center',
                            display: 'flex'
                        }}>
                            {t("webSite.home.encryptedSharing")}
                        </div>
                        <div style={{marginTop: 0}}>
                            <img src='/ban6.jpg' width='100%'/>
                        </div>
                        <div style={{color: '#fff', fontSize: 14, marginTop: 20, lineHeight: 2}}>
                            {t("webSite.home.encryptedSharing1")}
                        </div>
                        <div style={{color: '#fff', fontSize: 14, marginTop: 20, lineHeight: 2}}>
                            {t("webSite.home.encryptedSharing2")}
                        </div>
                    </div>
                </Col>

                <Col style={{
                    // background: '#004080',
                    display: 'flex', justifyContent: "center", alignItems: "center"
                }}
                     xs={24} sm={24}
                     md={8}
                     lg={8} xl={8} xxl={8}>
                    <div style={{padding: 10, height: '100%', maxWidth: 550, background: '#004080'}}>
                        <div style={{
                            color: '#fff',
                            fontSize: 28,
                            height: 50,
                            textAlign: "center",
                            alignItems: 'center',
                            justifyContent: 'center',
                            display: 'flex'
                        }}>
                            {t("webSite.home.deepMindSocial")}
                        </div>
                        <div style={{marginTop: 0}}>
                            <img src='/pic3.jpeg' width='100%'/>
                        </div>
                        <div style={{color: '#fff', fontSize: 14, marginTop: 20, lineHeight: 2}}>
                            {t("webSite.home.deepMindSocial1")}
                        </div>
                        <div style={{color: '#fff', fontSize: 14, marginTop: 20, lineHeight: 2}}>
                            {t("webSite.home.deepMindSocial2")}
                        </div>
                    </div>
                </Col>
            </Row>

            {/*What is lifecapsule*/}
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{padding: 20, marginTop: 80, maxWidth: 1080}}>
                    <div style={{
                        border: '2px solid red',
                        padding: 20,
                        borderRadius: 10
                    }}>
                        <Row>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} style={{}}>
                                <div style={{
                                    fontSize: 28,
                                    fontWeight: 'bold',
                                    color: '#f6027d'
                                }}>{t('webSite.home.whatIsLifeCapsule')}</div>

                                <div style={{
                                    fontSize: 14,
                                    lineHeight: 2.0,
                                    marginTop: 10
                                }}>{t('webSite.home.whatIsLifeCapsule1')}</div>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}
                                 style={{padding: 20}}>
                                <div style={{height: 300}}>
                                    <img src='/pic4.jpg' width='100%' height='100%' style={{objectFit: 'scale-down'}}/>
                                </div>
                            </Col>
                        </Row>

                        <div>

                        </div>
                    </div>
                    <div style={{border: '2px solid red', padding: 20, borderRadius: 10, marginTop: 20}}>
                        <div style={{
                            fontSize: 28,
                            fontWeight: 'bold',
                            color: '#027d41'
                        }}>{t('webSite.home.whatIsLifeCapsule2')}</div>
                        <div style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            marginTop: 10
                        }}>{t('webSite.home.whatIsLifeCapsule3')}</div>
                        <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule4')}</div>
                        <div style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            marginTop: 10
                        }}>{t('webSite.home.whatIsLifeCapsule5')}</div>
                        <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule6')}</div>
                        <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule7')}</div>

                        <div style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            marginTop: 10
                        }}>{t('webSite.home.whatIsLifeCapsule8')}</div>
                        <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule9')}</div>

                        <div style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            marginTop: 10
                        }}>{t('webSite.home.whatIsLifeCapsule10')}</div>
                        <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule11')}</div>

                        <div style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            marginTop: 10
                        }}>{t('webSite.home.whatIsLifeCapsule12')}</div>
                        <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule13')}</div>
                        <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule14')}</div>
                        <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule15')}</div>
                        <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule16')}</div>
                        <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule17')}</div>
                        <div style={{fontSize: 14, lineHeight: 2.0}}>{t('webSite.home.whatIsLifeCapsule18')}</div>
                    </div>
                </div>

                {/*Sign button*/}
                <div style={{marginTop: 40, textAlign: 'center'}}>
                    <Button
                        style={{background: '#333675', borderColor: '#333333', width: 200, height: 60, fontSize: 24}}
                        type="primary"
                        onClick={() => {
                            onSignIn();
                        }}
                        size='large'
                    >
                        Start Now
                    </Button>
                </div>

                <div style={{background: 'purple', padding: 20, maxWidth: 1080, borderRadius: 10, marginTop: 60}}>
                    <Row>
                        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <div style={{padding: 20}}>
                                <div style={{fontSize: 28, fontWeight: 'bold', color: '#fff'}}>
                                    {t('webSite.home.confidentialRules')}
                                </div>
                                <div style={{
                                    fontSize: 14,
                                    marginTop: 20,
                                    color: '#fff',
                                    lineHeight: 2
                                }}>{t('webSite.home.confidentialRules1')}</div>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <div style={{height: 300}}>
                                <img src='/pic5.jpeg' width='100%' height='100%' style={{objectFit: 'cover'}}/>
                            </div>
                        </Col>
                    </Row>

                </div>

                <div style={{background: 'green', padding: 20, borderRadius: 10, maxWidth: 1080, marginTop: 40}}>
                    <Row>
                        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <div>
                                <img src='/pic7.jpeg' width='100%' height='100%' style={{objectFit: 'cover'}}/>
                            </div>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} style={{padding: 20}}>
                            <div style={{fontSize: 28, fontWeight: 'bold', color: '#fff'}}>
                                {t('webSite.home.cloudSynchronization')}
                            </div>
                            <div style={{
                                fontSize: 14,
                                marginTop: 20,
                                color: '#fff',
                                lineHeight: 2
                            }}>{t('webSite.home.cloudSynchronization1')}</div>
                        </Col>
                    </Row>

                </div>

                <div style={{background: 'darkblue', padding: 20, borderRadius: 10, maxWidth: 1080, marginTop: 40}}>
                    <Row>
                        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} style={{padding: 20}}>
                            <div style={{fontSize: 28, fontWeight: 'bold', color: '#fff'}}>
                                {t('webSite.home.crossPlatform')}
                            </div>
                            <div style={{
                                fontSize: 14,
                                marginTop: 20,
                                color: '#fff',
                                lineHeight: 2
                            }}>{t('webSite.home.crossPlatform1')}</div>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <div style={{height: 400}}>
                                <img src='/pic6.png' width='100%' height='100%' style={{objectFit: 'fill'}}/>
                            </div>
                        </Col>
                    </Row>

                </div>
            </div>

            <div style={{
                // position: "fixed",
                marginTop: 60,
                bottom: 0,
                background: '#bbb',
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
                    <a href="#">Copyright © GOGOYANG DATATECH LIMIT</a>
                </div>
            </div>
        </div>
    )
        ;
};

export default Home;
