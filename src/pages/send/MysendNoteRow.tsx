import { Badge, Button, Card, Col, Row } from "antd";
import { t } from "i18next";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MySendNoteRow = (data: any) => {
  const { item } = data;
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div>
      <Card
        style={{
          background: themeColor.blockDark,
          color: themeColor.textLight,
          margin: 10,
        }}
      >
        <Row>
          <Col span={22}>
            <Row>
              <Col
                style={{
                  color: themeColor.textLight,
                  fontSize: item.readTime ? 16 : 20,
                  fontWeight: item.readTime ? "normal" : "bold",
                }}
              >
                {item.recipientTitle ? (
                  <span>
                    {item.recipientTitle}
                    {item.readTime ? null : <Badge dot></Badge>}
                  </span>
                ) : (
                  t("common.noTitle")
                )}
              </Col>
            </Row>
            <Row>
              <Col>{item.recipientName}</Col>
              <Col offset="1">{item.triggerType}</Col>
              <Col offset="1">{moment(item.sendTime).format("ll")}</Col>
            </Row>
          </Col>
          <Col span={2} style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                console.log(item);
                navigate("/main/MySendNoteDetail", {
                  state: { sendLogId: item.sendLogId },
                });
              }}
            >
              {t("common.btDetail")}
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
export default MySendNoteRow;
