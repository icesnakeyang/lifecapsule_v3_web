import {Badge, Button, Card, Col, Row} from "antd";
import moment from "moment";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

const MyReceiveNoteRow = (data: any) => {
    const {item} = data;
    const {t} = useTranslation();
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
    const navigate = useNavigate();

    return (
        <Card size='small'
            style={{background: themeColor.blockDark,marginTop:10}}
        >
            <Row style={{}}>
                <Col span={20}>
                    <Row>
                        <Col
                            style={{
                                color: themeColor.textLight,
                                fontSize: item.readTime ? 14 : 18,
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
                        <Col style={{color: themeColor.textHolder}}>
                            {item.sendUserNickname}
                        </Col>
                        <Col offset="1" style={{color: themeColor.textHolder}}>
                            {item.sendUserEmail}
                        </Col>
                        <Col offset="1" style={{color: themeColor.textHolder}}>
                            {moment(item.sendTime).format("ll")}
                        </Col>
                        <Col offset="1" style={{color: themeColor.textHolder}}>
                            {t("Trigger." + item.triggerType)}
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
                                state: {sendLogId: item.sendLogId},
                            });
                        }}
                    >
                        {t("common.btDetail")}
                    </Button>
                </Col>
            </Row>
        </Card>
    );
};
export default MyReceiveNoteRow;
