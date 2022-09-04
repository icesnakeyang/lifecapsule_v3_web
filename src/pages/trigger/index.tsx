import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  List,
  message,
  Modal,
  Row,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { apiListMyNoteRecipient } from "../../api/Api";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { removeRecipient, saveRecipientList } from "../../store/recipinetSlice";
import { removeTrigger } from "../../store/triggerSlice";
const TriggerPage = () => {
  const { noteId }: any = useLocation().state;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [modalRecipientDelete, setModalRecipientDelete] = useState(false);
  const dispatch = useDispatch();
  const recipientList = useSelector(
    (state: any) => state.recipientSlice.recipientList
  );
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
    return () => {};
  }, []);

  const loadAllData = () => {
    let params = {
      noteId,
    };
    apiListMyNoteRecipient(params)
      .then((res: any) => {
        if (res.code === 0) {
          dispatch(saveRecipientList(res.data.recipientList));
          setLoading(false);
        } else {
          message.error(t("syserr." + res.code));
        }
      })
      .catch(() => {
        message.error(t("syserr.10001"));
      });
  };

  const _renderRecipient = (item: any) => {
    return (
      <div style={{ marginTop: 10 }}>
        <List.Item
          style={{ background: themeColor.blockDark, padding: 10 }}
          actions={[
            <Button
              type="primary"
              size="small"
              onClick={() => {
                dispatch(removeRecipient());
                dispatch(removeTrigger());
                navigate("/main/TriggerDetail", {
                  state: { recipientId: item.recipientId },
                });
              }}
            >
              {t("common.btDetail")}
            </Button>,
          ]}
        >
          <div style={{ width: "100%", color: themeColor.textLight }}>
            <Row style={{}}>
              <Col>{item.email}</Col>
              <Col offset="1">{item.recipientName}</Col>
            </Row>
            <Row>
              <Col offset="1">{item.remark}</Col>
            </Row>
          </div>
        </List.Item>
      </div>
    );
  };
  return (
    <div>
      <div>
        <Alert
          description={t("trigger.tip1")}
          type="info"
          closable
          showIcon
          onClose={() => {}}
        />
      </div>
      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 200 }}
        >
          <Spin />
        </div>
      ) : (
        <div style={{}}>
          <div>
            <List
              style={{ marginTop: 10 }}
              dataSource={recipientList}
              renderItem={(item) => _renderRecipient(item)}
            ></List>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <Button
              type="primary"
              onClick={() => {
                navigate("/main/SelectRecipient", { state: { noteId } });
              }}
            >
              {t("recipient.btAddRecipient")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TriggerPage;
