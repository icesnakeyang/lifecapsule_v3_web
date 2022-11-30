import {Button, Card, Form, Input, message} from "antd";
import {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {apiSendVerifyCodeToEmail, apiSignByEmail, apiSignInByNothing} from "../../api/Api";
import {useNavigate} from "react-router-dom";
import {saveUserData, saveUserToken} from "../../store/userDataSlice";

let timer: any = null;

const LoginByEmail = () => {
    const [email, setEmail] = useState("")
    const [emailCode, setEmailCode] = useState("")
    const {t} = useTranslation()
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [codeStatus, setCodeStatus] = useState('')
    const [codeTime, setCodeTime] = useState(0);
    const [canInputCode, setCanInputCode] = useState(false);

    useEffect(() => {
        timer && clearInterval(timer);
        return () => {
            timer && clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        if (codeStatus === 'SUCCESS') {
            return;
        }
        if (codeTime === 10) {
            timer = setInterval(() => setCodeTime(item => --item), 1000);
        } else {
            if (codeTime === 0) {
                clearInterval(timer);
                setCodeStatus('CAN_SEND');
            }
        }
    }, [codeTime]);

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
        apiSignByEmail(params).then((res: any) => {
            if (res.code === 0) {
                dispatch(saveUserToken(res.data.token))
                localStorage.setItem("lifecapsule3_token", res.data.token);
                navigate("/", {replace: true})
            } else {
                message.error(t('syserr.' + res.code))
            }
        })
    }

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
                    setCodeTime(10);
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

    return (
        <div style={{
            background: themeColor.background,
            display: 'flex',
            justifyContent: 'center',
            height: '100%',
            alignItems: 'center'
        }}>
            <Card style={{background: themeColor.blockDark, width: 500}}>
                <Form>
                    <Form.Item>
                        <div style={{color: themeColor.textLight}}>{t('login.email')}</div>
                        <Input.Group compact>
                            <Input value={email} style={{
                                width: 'calc(100% - 140px)',
                                background: themeColor.blockDark,
                                color: themeColor.textLight
                            }}
                                   onChange={(e) => {
                                       setEmail(e.target.value)
                                   }}/>

                            {codeStatus === 'CAN_SEND' ?
                                <Button style={{width: 140}} type='primary' onClick={() => {
                                    onSendCode()
                                }}>Send</Button>
                                : codeStatus === 'SENDING' ?
                                    <Button style={{width: 140}} type='primary' loading>Sending</Button> :
                                    codeStatus === 'COUNTING' ?
                                        <Button type='primary' loading>{codeTime}...</Button>
                                        : null
                            }
                        </Input.Group>
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
                    <Button type="primary" onClick={() => {
                        onSignByEmail()
                    }}>
                        {t('login.btSignIn')}
                    </Button>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 20}}>
                    <Button type='text' onClick={() => {
                        onSignAsGuest()
                    }}><span style={{color: themeColor.textLight}}>{t('login.btGuestIn')}</span></Button>
                </div>
            </Card>
        </div>
    )
}
export default LoginByEmail
