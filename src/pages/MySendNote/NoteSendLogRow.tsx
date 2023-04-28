import {Card, Col, Row} from "antd";
import moment from "moment";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import MySendNoteDetail from "../send/MySendNoteDetail";
import {useNavigate} from "react-router-dom";

const NoteSendLogRow = (data: any) => {
    const {item} = data
    const {t} = useTranslation()
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const navigate = useNavigate()
    return (
        <Card size='small' style={{marginTop: 10, background: themeColor.blockDark}}>
            <Row>
                <Col style={{fontSize: 20}}>
                    <a style={{color: themeColor.textLight}} onClick={() => {
                        navigate('/main/MySendNoteDetail', {state: {sendLogId: item.sendLogId}})
                    }}>
                        {item.title}
                    </a>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={12} md={12} lg={8} xl={8}
                     xxl={8}
                     style={{color: themeColor.textHolder}}>{t('MyNoteSend.sendTime')}: {moment(item.sendTime).format('ll')}</Col>
                <Col xs={12} sm={12} md={12} lg={8} xl={8} xxl={8}
                     style={{color: themeColor.textHolder}}>{t('MyNoteSend.toName')}: {item.toName}</Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}
                     style={{color: themeColor.textHolder}}>{t('MyNoteSend.toEmail')}: {item.toEmail}</Col>
            </Row>
        </Card>
    )

}
export default NoteSendLogRow
