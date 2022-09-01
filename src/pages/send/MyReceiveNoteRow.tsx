import { Badge, Button, Col, Row } from "antd";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MyReceiveNoteRow = (data: any) => {
  const { item } = data;
  const { t } = useTranslation();
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
  const navigate = useNavigate();

  return (
    <div
      style={{ background: themeColor.blockDark, marginTop: 10, padding: 10 }}
    >
      <Row style={{}}>
        <Col span={20}>
          <Row>
            <Col
              style={{
                color: themeColor.textLight,
                fontSize: item.readTime ? 12 : 18,
                fontWeight: item.readTime ? "" : "bold",
              }}
            >
              {item.title ? item.title : <span>{t("common.noTitle")}</span>}
              {item.readTime ? null : (
                <Badge dot={true}></Badge>
                // <span style={{ color: themeColor.colorDanger }}>
                //   （{t("common.unRead")}）
                // </span>
              )}
            </Col>
          </Row>
          <Row>
            <Col style={{ color: themeColor.textLight }}>
              {item.sendUserNickname}
            </Col>
            <Col offset="1" style={{ color: themeColor.textLight }}>
              {item.sendUserEmail}
            </Col>
            <Col offset="1" style={{ color: themeColor.textLight }}>
              {moment(item.sendTime).format("ll")}
            </Col>
            <Col offset="1" style={{ color: themeColor.textLight }}>
              {t("trigger." + item.triggerType)}
            </Col>
          </Row>
        </Col>
        <Col
          span={4}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            type="primary"
            onClick={() => {
              navigate("/main/MyReceiveNoteDetail", {
                state: { sendLogId: item.sendLogId },
              });
            }}
          >
            {t("common.btDetail")}
          </Button>
        </Col>
      </Row>
    </div>
  );
};
export default MyReceiveNoteRow;
