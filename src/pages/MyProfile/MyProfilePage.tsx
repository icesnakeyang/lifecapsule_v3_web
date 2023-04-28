import {Button, Card, Form, Input, message, Modal} from "antd";
import {
    apiBindEmail,
    apiGetUserByToken,
    apiSaveUserNickname,
} from "../../api/Api";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    clearUserData,
    saveNickname,
    saveUserEmail,
    saveUserToken,
} from "../../store/userDataSlice";
import {clearNoteState} from "../../store/noteDataSlice";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const MyProfilePage = () => {
    const dispatch = useDispatch();
    const userEmail = useSelector((state: any) => state.userDataSlice.email);
    const [modalEmail, setModalEmail] = useState(false);
    const [emailCode, setEmailCode] = useState("");
    const {t} = useTranslation();
    const [emailEdit, setEmailEdit] = useState("");
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
    const nickname = useSelector((state: any) => state.userDataSlice.nickname);
    const loginName = useSelector((state: any) => state.userDataSlice.loginName);
    const [modalNickname, setModalNickname] = useState(false);
    const [nicknameEdit, setNicknameEdit] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = () => {
        apiGetUserByToken({})
            .then((res: any) => {
                if (res.code === 0) {
                    dispatch(saveUserEmail(res.data.userInfo.email));
                    dispatch(saveNickname(res.data.userInfo.nickname));
                    setNicknameEdit(res.data.userInfo.nickname);
                } else {
                    if (res.code === 10047) {
                        navigate("LoginPage")
                    }
                    message.error(t('syserr.' + res.code))
                }
            })
            .catch((err) => {
            });
    };

    const bindEmail = () => {
        if (!emailEdit) {
            return;
        }
        let params = {
            email: emailEdit,
            emailCode,
        };
        apiBindEmail(params)
            .then((res: any) => {
                if (res.code === 0) {
                    let token = localStorage.getItem("lifecapsule3_token");
                    if (token !== res.data.token) {
                        //切换用户
                        dispatch(clearUserData());
                        dispatch(clearNoteState());
                        localStorage.setItem("lifecapsule3_token", res.data.token);
                        dispatch(saveUserToken(res.data.token));
                        navigate("/");
                    } else {
                        navigate(-1);
                    }
                } else {
                    message.error(t("syserr." + res.code));
                }
            })
            .catch(() => {
                message.error(t("syserr.10001"));
            });
    };

    const onSaveNickname = () => {
        if (nickname === nicknameEdit) {
            return;
        }
        let params = {
            nickname: nicknameEdit,
        };
        apiSaveUserNickname(params)
            .then((res: any) => {
                if (res.code === 0) {
                    message.success(t("MyProfile.tipSaveNicknameSuccess"));
                    dispatch(saveNickname(nicknameEdit));
                    setModalNickname(false);
                } else {
                    message.error(t("syserr." + res.code));
                }
            })
            .catch(() => {
                message.error(t("syserr.10001"));
            });
    };
    return (
        <div style={{}}>
            <Card
                title={t("MyProfile.nickname")}
                style={{
                    background: themeColor.blockDark,
                    color: themeColor.textLight,
                }}
                headStyle={{color: themeColor.textLight}}
            >
                <div>{nickname}</div>
                <div style={{marginTop: 10}}>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                            setModalNickname(true);
                        }}
                    >
                        {t("MyProfile.btNickname")}
                    </Button>
                </div>
            </Card>
            <Card
                title={t("MyProfile.email")}
                style={{background: themeColor.blockDark, marginTop: 20}}
                headStyle={{color: themeColor.textLight}}
            >
                {userEmail ? (
                    <div style={{color: themeColor.textLight}}>
                        {t("MyProfile.email")}：{userEmail}
                    </div>
                ) : (
                    <div style={{color: themeColor.textLight}}>
                        <div>{t("MyProfile.tipNoEmail")}</div>
                        <div style={{marginTop: 10}}>
                            <Button
                                type={"primary"}
                                onClick={() => {
                                    setModalEmail(true);
                                }}
                                size="small"
                            >
                                {t("MyProfile.bindEmail")}
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            <Card title={t('MyProfile.titleLoginName')}
                  style={{background: themeColor.blockDark, marginTop: 20}}
                  headStyle={{color: themeColor.textLight}}
            >
                {loginName ?
                    <div style={{display: 'flex', color: themeColor.textLight}}>
                        <div>{t('MyProfile.loginName')}:</div>
                        <div style={{marginLeft: 10}}>{loginName}</div>
                    </div>
                    :
                    <div>
                        <div style={{color: themeColor.textLight}}>
                            {t('MyProfile.tipNoLoginName')}
                        </div>
                        <div style={{marginTop: 10}}>
                            <Button type='primary' onClick={() => {
                                navigate('/main/SetLoginName')
                            }}>{t('MyProfile.btSetLoginName')}</Button>
                        </div>
                    </div>
                }

            </Card>

            <Modal
                title={t("MyProfile.bindEmail")}
                visible={modalEmail}
                closable={true}
                maskClosable={false}
                onOk={() => {
                    // dispatch(saveUserEmail(emailEdit));
                    // bindEmail();
                    setModalEmail(false);
                }}
                onCancel={() => {
                    setModalEmail(false);
                }}
            >
                <div>{t('common.constructing')}</div>
                {/*<Form>*/}
                {/*    <Form.Item>*/}
                {/*        <div>{t("MyProfile.tip1")}</div>*/}
                {/*        <Input*/}
                {/*            value={emailEdit}*/}
                {/*            onChange={(e) => {*/}
                {/*                setEmailEdit(e.target.value);*/}
                {/*            }}*/}
                {/*        />*/}
                {/*    </Form.Item>*/}
                {/*    <Form.Item>*/}
                {/*        <div>code</div>*/}
                {/*        <Input*/}
                {/*            value={emailCode}*/}
                {/*            onChange={(e) => {*/}
                {/*                setEmailCode(e.target.value);*/}
                {/*            }}*/}
                {/*        />*/}
                {/*    </Form.Item>*/}
                {/*</Form>*/}
            </Modal>

            <Modal
                title={t("MyProfile.modalNicknameTitle")}
                visible={modalNickname}
                onCancel={() => setModalNickname(false)}
                onOk={() => {
                    onSaveNickname();
                }}
                closable={false}
                maskClosable={false}
            >
                <Form>
                    <Form.Item>
                        <div></div>
                        <Input
                            value={nicknameEdit}
                            onChange={(e) => {
                                setNicknameEdit(e.target.value);
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default MyProfilePage;
