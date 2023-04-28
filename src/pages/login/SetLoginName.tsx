import {useDispatch, useSelector} from "react-redux";
import {Button, Card, Form, Input, message} from "antd";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import {apiSetLoginNamePassword} from "../../api/Api";
import {useNavigate} from "react-router-dom";
import {saveLoginName} from "../../store/userDataSlice";

const SetLoginName = () => {
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const {t} = useTranslation()
    const [loginName, setLoginName] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [saving, setSaving] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onCreateLoginName = () => {
        if (!loginName) {
            message.error(t('login.tipNoLoginName'))
            return
        }
        if (!password) {
            message.error(t('login.tipNoPassword'))
            return
        }
        if (!password2) {
            message.error(t('login.tipNoPassword2'))
            return
        }
        if (password !== password2) {
            message.error(t('login.tipNoPassword3'))
            return
        }
        let params = {
            loginName,
            password
        }
        setSaving(true)
        apiSetLoginNamePassword(params).then((res: any) => {
            if (res.code === 0) {
                message.success(t('MyProfile.tipSetLoginNameSuccess'))
                dispatch(saveLoginName(loginName))
                navigate(-1)
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
        <div style={{background: themeColor.background}}>
            <Card headStyle={{color: themeColor.textLight, fontSize: 20}}
                  style={{background: themeColor.blockDark, color: 'red'}}
                  title={t('MyProfile.titleLoginName')}>
                <Form>
                    <Form.Item>
                        <div style={{color: themeColor.textLight}}>{t('MyProfile.loginName')}</div>
                        <Input
                            placeholder={t('login.loginNameHolder')}
                            onChange={(e: any) => {
                                setLoginName(e.target.value)
                            }}/>
                    </Form.Item>
                    <Form.Item>
                        <div style={{color: themeColor.textLight}}>{t('MyProfile.password')}</div>
                        <Input type='password' placeholder={t('login.passwordHolder')} onChange={(e: any) => {
                            setPassword(e.target.value)
                        }}/>
                    </Form.Item>
                    <Form.Item>
                        <div style={{color: themeColor.textLight}}>{t('MyProfile.password2')}</div>
                        <Input type='password' placeholder={t('login.password2Holder')} onChange={(e: any) => {
                            setPassword2(e.target.value)
                        }}/>
                    </Form.Item>
                </Form>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    {saving ?
                        <Button type='primary' loading>{t('common.btSaving')}</Button>
                        :
                        <Button type='primary' onClick={() => {
                            onCreateLoginName()
                        }}>{t('common.btSave')}</Button>}
                </div>
            </Card>
        </div>
    )
}
export default SetLoginName
