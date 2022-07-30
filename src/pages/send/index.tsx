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
} from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { apiListMyNoteRecipient } from "../../api/Api";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { removeRecipient, saveRecipientList } from "../../store/recipinetSlice";
import { removeTrigger } from "../../store/triggerSlice";
const SendPage = () => {
  const { noteId }: any = useLocation().state;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [modalRecipientDelete, setModalRecipientDelete] = useState(false);
  const dispatch = useDispatch();
  const recipientList = useSelector(
    (state: any) => state.recipientSlice.recipientList
  );
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);

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
      <List.Item
        style={{ background: themeColor.blockDark }}
        actions={[
          <Button
            type="primary"
            size="small"
            onClick={() => {
              dispatch(removeRecipient());
              dispatch(removeTrigger());
              navigate("/main/SendDetail", {
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
            <Col offset="1">{item.recipientName}</Col>
            <Col offset="1">{item.phone}</Col>
            <Col offset="1">{item.email}</Col>
          </Row>
          <Row>
            <Col offset="1">{item.remark}</Col>
          </Row>
        </div>
      </List.Item>
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
          {t("recipient.btAddToRecipient")}
        </Button>
      </div>
    </div>
  );
};

export default SendPage;
