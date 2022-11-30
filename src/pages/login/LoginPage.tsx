import {useDispatch, useSelector} from "react-redux";
import {Button, Card, Form, Input, Tabs} from "antd";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {apiSignInByNothing} from "../../api/Api";
import {saveUserData} from "../../store/userDataSlice";
import {useNavigate} from "react-router-dom";
import LoginnameLogin from "./LoginNameLogin";

const LoginPage = () => {
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const {t} = useTranslation()
    const [email, setEmail] = useState('')


    const [saving, setSaving] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const LoginEmail = () => {
        return (
            <div>
                <Card title={t('login.titleEmail')}>
                    <Form>
                        <Form.Item>
                            <div style={{display: 'flex'}}>
                                <Input placeholder={t('login.emailHolder')} value={email} onChange={(e: any) => {
                                    setEmail(e.target.value)
                                }}/>
                                <Button></Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        )
    }

    const items = [
        {label: t('login.tabEmail'), key: 'keyEmail', children: <LoginEmail/>}, // 务必填写 key
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
                    <Card style={{width: '50%'}}>
                        <Tabs items={items}/>
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
