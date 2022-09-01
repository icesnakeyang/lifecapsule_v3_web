import { Button, Card, Col, message, Row } from "antd";
import { useSelector } from "react-redux";
import { apiAddContactToRecipient } from "../../api/Api";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const RecipientRow = (data: any) => {
  const { item } = data;
  const { noteId } = data;
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onAddContactToRecipient = () => {
    let params = {
      noteId: noteId,
      contactId: item.contactId,
    };
    apiAddContactToRecipient(params)
      .then((res: any) => {
        if (res.code === 0) {
          message.success(t("recipient.tipAddSuccess"));
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
    <Card style={{ background: themeColor.blockDark }}>
      <Row style={{ width: "100%" }}>
        <Col xs={24} sm={14} md={14} lg={5} xl={5} xxl={5}>
          <span style={{ color: themeColor.textLight }}>
            {item.contactName}
          </span>
        </Col>
        <Col xs={24} sm={10} md={10} lg={5} xl={5} xxl={5}>
          <span style={{ color: themeColor.textLight }}>{item.phone}</span>
        </Col>
        <Col xs={24} sm={14} md={14} lg={10} xl={10} xxl={10}>
          <span style={{ color: themeColor.textLight }}>{item.email}</span>
        </Col>
        <Col xs={24} sm={10} md={10} lg={4} xl={4} xxl={4}>
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
    </Card>
  );
};

export default RecipientRow;
