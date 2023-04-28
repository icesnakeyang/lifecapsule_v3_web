import {Card, Col, Row} from "antd";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import moment from "moment";
import {useNavigate} from "react-router-dom";

const TriggerRow = (data: any) => {
    const {item} = data
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const {t} = useTranslation()
    const navigate = useNavigate()
    return (
        <Card size='small' style={{background: themeColor.blockDark, marginTop: 10}}>
            <Row>
                <Col style={{color: themeColor.textLight, fontSize: 20}}><a onClick={() => {
                    navigate('/main/MyTriggerEdit', {state: {triggerId: item.triggerId}})
                }} style={{color: themeColor.textLight}}>{item.title}</a></Col>
            </Row>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={8} xxl={6}
                     style={{color: themeColor.textHolder}}>{t('MyNoteSend.toName')}: {item.toName}</Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={8} xxl={6}
                     style={{color: themeColor.textHolder}}>{t('MyNoteSend.toEmail')}: {item.toEmail}</Col>

                <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={6}
                     style={{color: themeColor.textHolder}}>{t('Trigger.triggerType')}: {t('Trigger.'+item.triggerType)}</Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={6}
                     style={{color: themeColor.textHolder}}>{t('Trigger.sendTime')}: {moment(item.triggerTime).format('lll')}</Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={6}
                     style={{color: themeColor.textHolder}}>{t('triggerQue.status')}: {t('triggerQue.' + item.status)}</Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={6}
                     style={{color: themeColor.textHolder}}>{t('triggerQue.isEmailSentAlready')} {item.toEmailStatus ? t('triggerQue.sendAlready') : t('triggerQue.notSend')}</Col>
                <Col xs={24} sm={24} md={24} lg={16} xl={24} xxl={6}
                     style={{color: themeColor.textHolder}}>{t('triggerQue.isTheNoteSentYet')} {item.toUserStatus === 'SEND_COMPLETE' ? t('triggerQue.sendAlready') : t("triggerQue.notSend")}</Col>
            </Row>
        </Card>
    )
}
export default TriggerRow
