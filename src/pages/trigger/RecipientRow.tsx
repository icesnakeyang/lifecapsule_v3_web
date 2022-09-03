import {Button, Card, Col, message, Row} from "antd";
import {useSelector} from "react-redux";
import {apiAddContactToRecipient, apiAddEmailToRecipient} from "../../api/Api";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

const RecipientRow = (data: any) => {
    const {item} = data;
    const {noteId} = data;
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
    const {t} = useTranslation();
    const navigate = useNavigate();
    const [saving, setSaving]=useState(false)

    console.log(item)

    const onAddContactToRecipient = () => {
        let params = {
            noteId: noteId,
            email: item.email
        };

        console.log(params)
        setSaving(true)
        apiAddEmailToRecipient(params).then((res: any) => {
            if (res.code === 0) {
                message.success(t('recipient.tipAddSuccess'))
                navigate(-1)
            } else {
                message.error(t('syserr.' + res.code))
                setSaving(false)
            }
        }).catch(() => {
            message.error(t('syserr.10001'))
            setSaving(false)
        })
    };

    return (
        <div style={{background: themeColor.blockDark, marginTop: 10, padding: 10}}>
            <Row style={{width: "100%", color:themeColor.textLight}}>
                <Col xs={12} sm={16} md={16} lg={18} xl={20} xxl={20}>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                            {item.email}
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                            {item.contactName}
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} sm={8} md={8} lg={6} xl={4} xxl={4}>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                            onAddContactToRecipient();
                        }}
                    >
                        {t("recipient.btAddToRecipient")}
                    </Button>
                </Col>
            </Row>
        </div>
    );
};

export default RecipientRow;
