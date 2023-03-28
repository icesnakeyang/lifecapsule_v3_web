import {Button, Card, Form, Input, message} from "antd";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {apiSignByLoginName} from "../../api/Api";
import {clearUserData, saveLoginName, saveUserData, saveUserToken} from "../../store/userDataSlice";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

const LoginNameLogin = () => {
    const {t} = useTranslation()
    const [password, setPassword] = useState('')
    const [saving, setSaving] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)

    const loginName = useSelector((state: any) => state.userDataSlice.loginName)

    const onSignLoginNamePassword = () => {
        if (!loginName) {
            message.error(t('login.tipNoLoginName'))
            return
        }
        if (!password) {
            message.error(t('login.tipNoPassword'))
            return;
        }

        let params = {
            loginName,
            password
        }
        setSaving(true)
        apiSignByLoginName(params).then((res: any) => {
            if (res.code === 0) {
                dispatch(clearUserData())
                let userData = {
                    token: res.data.token,
                    timerPrimary: res.data.timerPrimary,
                    nickname: res.data.nickname,
                    loginName: res.data.loginName
                }
                dispatch(saveUserData(userData))
                localStorage.setItem("lifecapsule3_token", res.data.token);
                navigate("/main/dashboard", {replace: true})
                message.success(t('login.tipLoginSuccess'))
            } else {
                message.error(t('syserr.' + res.code))
                setSaving(false)
            }
        }).catch(() => {
            message.error(t('syserr.10001'))
            setSaving(false)
        })
    }

    return (
        <div>
            <Card style={{background: themeColor.blockDark}} title={t('login.titleLoginName')}
                  headStyle={{color: themeColor.textLight}}
            >
                <Form>
                    <Form.Item>
                        <div style={{color: themeColor.textLight}}>{t('login.loginNameHolder')}</div>
                        <Input
                            style={{background: themeColor.blockDark, color: themeColor.textLight}}
                            onChange={(e: any) => {
                                dispatch(saveLoginName(e.target.value))
                                // setLoginName(e.target.value)
                            }}
                            value={loginName}
                        />
                    </Form.Item>
                    <Form.Item>
                        <div style={{
                            color: themeColor.textLight,
                        }}> {t('login.passwordHolder')}</div>
                        <Input
                            style={{background: themeColor.blockDark, color: themeColor.textLight}}
                            type='password' onChange={(e: any) => {
                            setPassword(e.target.value)
                        }} value={password}/>
                    </Form.Item>
                </Form>

                <div style={{textAlign: 'center'}}>
                    {saving ?
                        <Button type='primary' loading>{t('login.btSignIn')}</Button> :
                        <Button type='primary' onClick={() => {
                            onSignLoginNamePassword()
                        }
                        }>{t('login.btSignIn')}</Button>}
                </div>
            </Card>
        </div>
    )
}
export default LoginNameLogin
