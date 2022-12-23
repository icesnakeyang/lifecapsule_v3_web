import {useDispatch, useSelector} from "react-redux";
import {Button, Card, Form, Input, message, Tabs} from "antd";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {apiSendVerifyCodeToEmail, apiSignByEmail, apiSignInByNothing} from "../../api/Api";
import {saveUserData, saveUserEmail, saveUserToken} from "../../store/userDataSlice";
import {useNavigate} from "react-router-dom";
import LoginnameLogin from "./LoginNameLogin";

let timer: any = null;

const LoginPage = () => {
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const {t} = useTranslation()
    const [email, setEmail] = useState('')
    // const [codeStatus, setCodeStatus] = useState('')
    const [codeStatus, setCodeStatus] = useState('CAN_SEND')
    const [codeTime, setCodeTime] = useState(60);
    const [canInputCode, setCanInputCode] = useState(false);
    const [emailCode, setEmailCode] = useState("")
    const [saving, setSaving] = useState(false)

    const dispatch = useDispatch()

    const navigate = useNavigate()

    useEffect(() => {
        // timer && clearInterval(timer);
        return () => {
            timer && clearInterval(timer);
        };
    }, []);


    useEffect(() => {
        if (codeStatus === 'SUCCESS') {
            return;
        }
        if (codeTime === 60) {
            timer = setInterval(() => setCodeTime(item => --item), 1000);
        } else {
            if (codeTime === 0) {
                clearInterval(timer);
                setCodeStatus('CAN_SEND');
            }
        }
    }, [codeTime]);


    const onSendCode = () => {
        let reg = /^([a-z0-9_\.-]+)@([\da-z\.]+)\.([a-z\.]{2,6})$/g;
        if (!reg.test(email)) {
            message.error(t('email.tipValidateEmailErr'))
            return;
        }

        let params = {
            email,
            actType: 'LOGIN',
        };
        setCodeStatus('SENDING');
        apiSendVerifyCodeToEmail(params)
            .then((res: any) => {
                if (res.code === 0) {
                    setCodeStatus('COUNTING');
                    setCodeTime(60);
                    setCanInputCode(true);
                } else {
                    message.error(t('syserr.' + res.code))
                    setCodeStatus('CAN_SEND');
                }
            })
            .catch(() => {
                message.error(t('syserr.10001'))
                setCodeStatus('CAN_SEND');
            });
    }

    const onSignByEmail = () => {
        if (!email) {
            message.error(t('login.tipNoEmail'))
            return
        }
        if (!emailCode) {
            message.error(t('login.tipNoEmailCode'))
            return
        }
        let params = {
            email,
            emailCode
        }
        setSaving(true)
        apiSignByEmail(params).then((res: any) => {
            if (res.code === 0) {
                dispatch(saveUserToken(res.data.token))
                localStorage.setItem("lifecapsule3_token", res.data.token);
                message.success(t('login.tipLoginSuccess'))
                navigate("/", {replace: true})
            } else {
                message.error(t('syserr.' + res.code))
                setSaving(false)
            }
        }).catch(() => {
            setSaving(false)
        })
    }

    const items = [
        // email
        {
            label: t('login.tabEmail'), key: 'keyEmail', children: <>
                <div>
                    <Card style={{background: themeColor.blockDark}}
                          headStyle={{color: themeColor.textLight}}
                          title={t('login.titleEmail')}>
                        <Form>
                            <Form.Item>
                                <div style={{}}>
                                    <div style={{color: themeColor.textLight}}>{t('login.emailHolder')}</div>
                                    <Input.Group compact>
                                        <Input
                                            style={{
                                                width: 'calc(100% - 120px)',
                                                background: themeColor.blockDark,
                                                color: themeColor.textLight
                                            }}
                                            value={email}
                                            onChange={(e: any) => {
                                                setEmail(e.target.value)
                                            }}/>
                                        {codeStatus === 'CAN_SEND' ?
                                            <Button style={{}} type='primary' onClick={() => {
                                                onSendCode()
                                            }}>{t('login.btCanSend')}</Button>
                                            : codeStatus === 'SENDING' ?
                                                <Button style={{}} type='primary'
                                                        loading>{t('login.btSending')}</Button> :
                                                codeStatus === 'COUNTING' ?
                                                    <Button type='primary' loading>{codeTime}...</Button>
                                                    : null
                                        }
                                    </Input.Group>
                                </div>
                            </Form.Item>
                            {canInputCode ?
                                <Form.Item>
                                    <div style={{color: themeColor.textLight}}>{t('login.emailCode')}</div>
                                    <Input value={emailCode}
                                           style={{background: themeColor.blockDark, color: themeColor.textLight}}
                                           onChange={(e) => {
                                               setEmailCode(e.target.value)
                                           }}/>
                                </Form.Item> : null}
                        </Form>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            {saving ?
                                <Button type="primary" loading>
                                    {t('login.btSignIning')}
                                </Button> :
                                <Button type="primary" onClick={() => {
                                    onSignByEmail()
                                }}>
                                    {t('login.btSignIn')}
                                </Button>}
                        </div>
                    </Card>
                </div>
            </>
        },
        {label: t('login.tabLoginName'), key: 'keyLoginName', children: <LoginnameLogin/>},
    ];

    const onSignAsGuest = () => {
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
    }


    return (
        <div style={{}}>
            <div style={{marginTop: 100}}>
                <div style={{}}>
                    <div style={{
                        color: themeColor.textLight,
                        textAlign: 'center',
                        fontSize: 48,
                    }}>{t('login.greeting1')}</div>
                    <div style={{
                        color: themeColor.textLight,
                        textAlign: 'center',
                        fontSize: 20,
                        marginTop: 20
                    }}>{t('login.greeting2')}</div>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
                    <Card style={{width: '50%', background: themeColor.blockDark, color: 'red'}}>
                        <Tabs style={{color: themeColor.textLight}} items={items}/>
                    </Card>
                </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'center', marginTop: 40}}>
                <Button type='text' style={{color: themeColor.textLight}}>{t('login.register')}</Button>
                <Button type='text' style={{color: themeColor.textLight}} onClick={() => {
                    onSignAsGuest()
                }}>{t('login.btGuestIn')}</Button>
            </div>

        </div>
    )
}
export default LoginPage
