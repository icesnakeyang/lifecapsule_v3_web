import {Button, Card, Form, Input, message} from "antd";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {apiSignByEmail} from "../../api/Api";
import {useNavigate} from "react-router-dom";
import { saveUserToken } from "../../store/userDataSlice";

const LoginByEmail = () => {
    const [email, setEmail] = useState("")
    const [emailCode, setEmailCode] = useState("")
    const {t} = useTranslation()
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const navigate=useNavigate()
    const dispatch=useDispatch()

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
        apiSignByEmail(params).then((res:any)=>{
            if(res.code===0){
                dispatch(saveUserToken(res.data.token))
                localStorage.setItem("lifecapsule3_token", res.data.token);
                navigate("/", {replace:true})
            }else{
                message.error(t('syserr.'+res.code))
            }
        })
    }

    const onSignAsGuest=()=>{
        navigate("/", {replace:true})
    }
    return (
        <div style={{
            background: themeColor.background,
            display: 'flex',
            justifyContent: 'center',
            height: '100%',
            alignItems: 'center'
        }}>
            <Card style={{background: themeColor.blockDark, width: 400}}>
                <Form>
                    <Form.Item>
                        <div style={{color: themeColor.textLight}}>{t('login.email')}</div>
                        <Input value={email} style={{background: themeColor.blockDark, color: themeColor.textLight}}
                               onChange={(e) => {
                                   setEmail(e.target.value)
                               }}/>
                    </Form.Item>
                    <Form.Item>
                        <div style={{color: themeColor.textLight}}>{t('login.emailCode')}</div>
                        <Input value={emailCode} style={{background: themeColor.blockDark, color: themeColor.textLight}}
                               onChange={(e) => {
                                   setEmailCode(e.target.value)
                               }}/>
                    </Form.Item>
                </Form>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <Button type="primary" onClick={() => {
                        onSignByEmail()
                    }}>
                        {t('login.btSignIn')}
                    </Button>
                </div>
                <div style={{display:'flex', justifyContent:'center',marginTop:20}}>
                    <Button  type='text' onClick={()=>{
                        onSignAsGuest()
                    }}><span style={{color:themeColor.textLight}}>{t('login.btGuestIn')}</span></Button>
                </div>
            </Card>
        </div>
    )
}
export default LoginByEmail
