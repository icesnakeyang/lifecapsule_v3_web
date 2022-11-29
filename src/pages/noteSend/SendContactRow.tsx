import {Button, Card, Col, Row} from "antd"
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {saveSendToEmail, saveSendToName} from "../../store/noteSendSlice";

const SendContactRow = (data: any) => {
    const {t} = useTranslation()
    const {item,onSelect} = data
    const dispatch = useDispatch()
    return (
        <Row style={{background: 'red', margin: 10, padding: 10}}>
            <Col>{item.contactName}</Col>
            <Col>{item.email}</Col>
            <Col><Button type='primary' onClick={() => {
                let data={
                    contactName:item.contactName,
                    email:item.email
                }
                dispatch(saveSendToName(item.contactName))
                dispatch(saveSendToEmail(item.email))
                onSelect(data)

                // 这里要调用父组件的onOk方法
            }}>{t('common.btSelect')}</Button></Col>
        </Row>
    )
}

export default SendContactRow
