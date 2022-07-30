import {Button, Col, message, Row} from "antd";
import {useSelector} from "react-redux";
import {apiAddContactToRecipient} from "../../api/Api";
import {useTranslation} from 'react-i18next'
import {useNavigate} from "react-router-dom";

const RecipientRow = (data: any) => {
    const {item} = data
    console.log(item)
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const {t} = useTranslation()
    const navigate = useNavigate()

    const onAddContactToRecipient = () => {
        let params = {
            noteId: item.noteId,
            contactId: item.contactId
        };
        apiAddContactToRecipient(params)
            .then((res: any) => {
                if (res.code === 0) {
                    message.success(t("recipinet.tipAddSuccess"));
                    navigate(-1);
                } else {
                    message.error(t("syserr." + res.code));
                }
            })
            .catch(() => {
                message.error(t("syserr.10001"));
            });
    };

    return (
        <div>
            <Row style={{width: "100%"}}>
                <Col>
            <span style={{color: themeColor.textLight}}>
              {item.contactName}
            </span>
                </Col>
                <Col offset="1">
                    <span style={{color: themeColor.textLight}}>{item.phone}</span>
                </Col>
                <Col offset="1">
                    <span style={{color: themeColor.textLight}}>{item.email}</span>
                </Col>
                <Col
                    style={{
                        fontSize: "12px",
                        color: "#ccc",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    offset="1"
                >
                    <span style={{color: themeColor.textLight}}>{item.remark}</span>
                </Col>
                <Col>
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
    )
}

export default RecipientRow;