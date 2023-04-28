import {Button, Card, Col, Row} from "antd"
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {saveSendToEmail, saveSendToName} from "../../../store/noteSendSlice";

const SendContactRow = (data: any) => {
    const {t} = useTranslation()
    const {item, onSelect} = data
    const dispatch = useDispatch()
    return (
        <Card size='small' style={{marginTop: 5, paddingLeft:10}} bodyStyle={{margin: 0, padding: 2}}>
            <Row style={{alignItems: 'center'}}>
                <Col xs={12} sm={8} md={8} lg={8} xl={8} xxl={8}>{item.contactName}</Col>
                <Col xs={12} sm={11} md={11} lg={11} xl={11} xxl={11}>{item.email}</Col>
                <Col xs={24} sm={5} md={5} lg={5} xl={5} xxl={5}><Button type='primary' onClick={() => {
                    let data = {
                        contactName: item.contactName,
                        email: item.email
                    }
                    dispatch(saveSendToName(item.contactName))
                    dispatch(saveSendToEmail(item.email))
                    onSelect(data)

                    // 这里要调用父组件的onOk方法
                }}>{t('common.btSelect')}</Button></Col>
            </Row>
        </Card>
    )
}

export default SendContactRow
