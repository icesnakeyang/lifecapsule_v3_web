import {Button, Card, Col, Row} from "antd";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const ContactRow = (data: any) => {
    const {item} = data
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const navigate = useNavigate()
    const {t} = useTranslation()

    return (
        <Card size='small' style={{background: themeColor.blockDark, marginTop: 10}}>
            <Row gutter={[16, {xs: 2, sm: 16, md: 24, lg: 32}]}>
                <Col xs={24} sm={10} md={10} lg={10} xl={8} xxl={8} style={{color: themeColor.textLight}}>
                    {item.contactName}
                </Col>
                <Col xs={24} sm={10} md={10} lg={10} xl={8} xxl={8}
                     style={{color: themeColor.textLight}}>
                    {item.email}
                </Col>
                <Col xs={24} sm={4} md={4} lg={4} xl={8} xxl={8}>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                            navigate("/main/contactEdit", {
                                state: {contactId: item.contactId},
                            });
                        }}
                    >
                        {t("common.btDetail")}
                    </Button>
                </Col>
            </Row>
        </Card>
    )
}
export default ContactRow
