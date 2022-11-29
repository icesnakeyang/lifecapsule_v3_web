import {Col, Row} from "antd";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import moment from "moment";

const TriggerRow = (data: any) => {
    const {item} = data
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const {t} = useTranslation()
    console.log(item)
    return (
        <div style={{background: themeColor.blockDark, marginTop: 10, padding: 10, borderRadius: 5}}>
            <Row>
                <Col style={{color: themeColor.textLight, fontSize: 20}}><a onClick={()=>{

                }}>{item.title}</a></Col>
            </Row>
            <Row>
                <Col style={{color: themeColor.textLight}}>{t('noteSent.toName')}: {item.toName}</Col>
                <Col offset={1} style={{color: themeColor.textLight}}>{t('noteSent.toEmail')}: {item.toEmail}</Col>

                <Col offset={1}
                     style={{color: themeColor.textLight}}>{t('trigger.triggerType')}: {item.triggerType}</Col>
                <Col offset={1}
                     style={{color: themeColor.textLight}}>{t('trigger.sendTime')}: {moment(item.triggerTime).format('lll')}</Col>
                <Col offset={1} style={{color: themeColor.textLight}}>{t('noteSent.fromName')}: {item.fromName}</Col>
                <Col offset={1}
                     style={{color: themeColor.textLight}}>{t('triggerQue.status')}: {t('triggerQue.' + item.status)}</Col>
                <Col offset={1}
                     style={{color: themeColor.textLight}}>{item.toEmailStatus ? t('triggerQue.sendAlready') : t('triggerQue.notSend')}</Col>
                <Col offset={1} style={{color: themeColor.textLight}}>{item.toUserStatus}</Col>
            </Row>
        </div>
    )
}
export default TriggerRow
