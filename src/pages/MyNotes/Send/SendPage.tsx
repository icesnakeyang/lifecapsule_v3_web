import {useNavigate} from "react-router-dom";
import {Button, Card, Col, Row} from "antd";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

const SendPage = () => {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)

    return (<div style={{}}>
        <Row gutter={[16, {xs: 16, sm: 16, md: 16, lg: 16}]}>
            <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                <Card style={{minHeight: 140, background: themeColor.blockDark}}>
                    <div style={{}}>
                        <Button style={{background: 'red', color: '#fff'}} block onClick={() => {
                            navigate('/main/InstantSend')
                        }}>{t('MyNotes.SendPage.sendInstantly')}</Button>
                    </div>
                    <div style={{marginTop: 10}}>{t('MyNotes.SendPage.tipSendInstantly')}</div>
                </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                <Card style={{minHeight: 140, background: themeColor.blockDark}}>
                    <div style={{}}>
                        <Button type='primary' block onClick={() => {
                            navigate('/main/PrimarySend')
                        }}>{t('MyNotes.SendPage.primaryCountdown')}</Button>
                    </div>
                    <div style={{marginTop: 10}}>{t('MyNotes.SendPage.tipPrimaryCountdown')}</div>
                </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                <Card style={{minHeight: 140, background: themeColor.blockDark}}>
                    <div style={{}}>
                        <Button style={{background: 'green', color: '#fff'}}
                                block onClick={() => {
                            navigate('/main/DatetimeSend')
                        }}>{t('MyNotes.SendPage.sendByDatetime')}</Button>
                    </div>
                    <div style={{marginTop: 10}}>{t('MyNotes.SendPage.tipSendByDatetime')}</div>
                </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                <Card style={{minHeight: 140, background: themeColor.blockDark}}>
                    <div style={{}}>
                        <Button style={{background: '#1f7069', color: '#fff'}}
                                block onClick={() => {
                            navigate('/main/PublishToTopic')
                        }}>{t('MyNotes.SendPage.publishToTopic')}</Button>
                    </div>
                    <div style={{marginTop: 10}}>{t('MyNotes.SendPage.tipPublishToTopic')}</div>
                </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                <Card style={{minHeight: 140, background: themeColor.blockDark}}>
                    <div style={{}}>
                        <Button style={{background: '#ff469c', color: '#fff'}}
                                block onClick={() => {
                            navigate('/main/PublishToMotto')
                        }}>{t('MyNotes.SendPage.publishToMotto')}</Button>
                    </div>
                    <div style={{marginTop: 10}}>{t('MyNotes.SendPage.tipPublishToMotto')}</div>
                </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={6} xxl={6}>
                <Card style={{minHeight: 140, background: themeColor.blockDark}}>
                    <div>
                        <Button type='primary' style={{background: '#2e9599'}}
                                block onClick={() => {
                            navigate("/main/PublishToPublicWeb")
                        }}>{t('MyNotes.SendPage.publishToPublic')}</Button>
                    </div>
                    <div style={{marginTop: 10}}>{t('MyNotes.SendPage.tipPublishToPublic')}</div>
                </Card>
            </Col>
        </Row>
    </div>)
}
export default SendPage;
