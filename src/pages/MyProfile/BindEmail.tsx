import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {Breadcrumb, Button, Card, Form, Input, message, Space} from "antd";
import {useEffect, useState} from "react";
import {apiBindEmail, apiSendVerifyCodeToEmail, apiSignByEmail} from "../../api/Api";
import {saveUserToken} from "../../store/userDataSlice";

let timer: any = null;

const BindEmail = () => {
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const {t} = useTranslation()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [codeStatus, setCodeStatus] = useState('CAN_SEND')
    const [codeTime, setCodeTime] = useState(0);
    const [canInputCode, setCanInputCode] = useState(false);
    const [emailCode, setEmailCode] = useState("")
    const [saving, setSaving] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        timer && clearInterval(timer);
        return () => {
            timer && clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        console.log(codeTime)
        if (codeStatus === 'SUCCESS') {
            return;
        }
        if (codeTime === 10) {
            timer = setInterval(() => setCodeTime(item => --item), 1000);
        } else {
            if (codeTime <= 0) {
                console.log('clear timer')
                clearInterval(timer);
                setCodeStatus('CAN_SEND');
            }
        }
    }, [codeTime]);

    const onSendCode = () => {
        let reg = /^([a-z0-9_\.-]+)@([\da-z\.]+)\.([a-z\.]{2,6})$/g;
        if (!reg.test(email)) {
            message.error(t('MyProfile.tipNoEmail3'))
            return;
        }

        let params = {
            email,
            actType: 'BIND',
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

    const onBindEmail = () => {
        if (!email) {
            message.error(t('MyProfile.tipNoEmail2'))
            return;
        }
        if (!emailCode) {
            message.error(t('MyProfile.tipNoEmailCode'))
            return;
        }
        let params = {
            email: String(email).toLowerCase(),
            emailCode,
        };
        setSaving(true);
        apiBindEmail(params)
            .then((res: any) => {
                if (res.code === 0) {
                    message.success(t('MyProfile.tipBindEmailSuccess'))
                    navigate(-1)
                } else {
                    message.error(t('syserr.' + res.code))
                    setSaving(false);
                }
            })
            .catch(() => {
                message.error(t('syserr.10001'))
                setSaving(false);
            });
    };

    return (
        <div>
            <Breadcrumb items={[
                {
                    title: t('common.home'),
                    href: '/main/dashboard'
                },
                {
                    title: t('nav.bindEmail')
                }
            ]}/>

            <Card size='small' style={{marginTop: 20, background: themeColor.blockDark}}>
                <Form>
                    <Form.Item>
                        <div style={{}}>
                            <div style={{color: themeColor.textLight}}>{t('login.emailHolder')}</div>
                            <Space.Compact>
                                <Input
                                    style={{
                                        width: 200,
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
                            </Space.Compact>
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
                            onBindEmail();
                        }}>
                            {t('MyProfile.btBindEmail')}
                        </Button>}
                </div>
            </Card>
        </div>
    )
}
export default BindEmail
