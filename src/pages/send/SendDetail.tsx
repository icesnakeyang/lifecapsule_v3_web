import {
  Alert,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Tag,
} from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  apiDeleteRecipient,
  apiGetNoteRecipientTrigger,
  apiGetRecipient,
  apiSaveNoteRecipientTrigger,
} from "../../api/Api";
import { saveRecipient } from "../../store/recipinetSlice";
import { saveTrigger, saveTriggerTime } from "../../store/triggerSlice";
import { useTranslation } from "react-i18next";

const SendDetail = () => {
  const { recipientId }: any = useLocation().state;
  const dispatch = useDispatch();
  const recipient = useSelector((state: any) => state.recipientSlice.recipient);
  const [modalEditRecipient, setModalEditRecipient] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [modalTrigger, setModalTrigger] = useState(false);
  const [triggerType, setTriggerType] = useState("TIMER_TYPE_PRIMARY");
  const triggerTime = useSelector(
    (state: any) => state.triggerSlice.triggerTime
  );
  const { t } = useTranslation();
  const trigger = useSelector((state: any) => state.triggerSlice.trigger);
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [modalDeleteRecipient, setModalDeleteRecipient] = useState(false);

  useEffect(() => {
    loadAllData();
    return () => {};
  }, []);

  const loadAllData = () => {
    let params = {
      recipientId,
    };
    apiGetRecipient(params).then((res: any) => {
      if (res.code === 0) {
        dispatch(saveRecipient(res.data.recipient));
        setRecipientName(res.data.recipient.recipientName);
      }
    });
    apiGetNoteRecipientTrigger(params)
      .then((res: any) => {
        if (res.code === 0) {
          if (res.data.trigger) {
            dispatch(saveTrigger(res.data.trigger));
          }
        } else {
          message.error(t("syserr." + res.code));
        }
      })
      .catch(() => {
        message.error(t("syserr.10001"));
      });
  };

  const saveEditRecipient = () => {
    let params = {
      recipientName,
      recipientId,
    };
  };

  const onSaveTrigger = () => {
    let params = {
      recipientId,
      triggerType,
      triggerTime,
      triggerId: (trigger && trigger.triggerId) || null,
    };
    apiSaveNoteRecipientTrigger(params)
      .then((res: any) => {
        if (res.code === 0) {
          dispatch(saveTrigger(res.data.trigger));
          setModalTrigger(false);
        } else {
          message.error(t("syserr." + res.code));
        }
      })
      .catch(() => {
        message.error(t("syserr.10001"));
      });
  };

  const onDeleteRecipient = () => {
    let params = {
      recipientId,
    };
    setSaving(true);
    apiDeleteRecipient(params)
      .then((res: any) => {
        if (res.code === 0) {
          message.success(t("recipient.tipDeleteRcipientSuccess"));
          navigate(-1);
        } else {
          message.error(t("syserr." + res.code));
          setSaving(false);
        }
      })
      .catch(() => {
        message.error(t("syserr.10001"));
        setSaving(false);
      });
  };

  return (
    <div>
      {recipient ? (
        <>
          <Card
            title={t("recipient.recipientInfo")}
            extra={
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  setModalEditRecipient(true);
                }}
              >
                {t("common.btEdit")}
              </Button>
            }
          >
            <p>
              {t("recipient.recipientName")}???{recipient.recipientName}
            </p>
            <p>
              {t("recipient.recipientPhone")}???{recipient.phone}
            </p>
            <p>
              {t("recipient.recipientEmail")}???{recipient.email}
            </p>
          </Card>
        </>
      ) : null}
      {trigger ? (
        <>
          <Card
            style={{ marginTop: 10 }}
            title={t("trigger.sendCondition")}
            extra={
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  setModalTrigger(true);
                }}
              >
                {t("common.btEdit")}
              </Button>
            }
          >
            {trigger.triggerType === "TIMER_TYPE_PRIMARY" ? (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Tag style={{ fontSize: 16 }} color="#f50">
                    {t("trigger.TIMER_TYPE_PRIMARY")}
                  </Tag>
                  {t("trigger.tip5")}
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Tag style={{ fontSize: 16 }} color="#108ee9">
                    {t("trigger.TIMER_TYPE_DATETIME")}
                  </Tag>
                  {t("trigger.tip6")}
                </div>
                <p>
                  {t("trigger.sendTime")}???
                  {moment(trigger.triggerTime).format("LLL")}
                </p>
              </>
            )}
          </Card>
        </>
      ) : (
        <div style={{ marginTop: 10 }}>
          <Alert message={t("trigger.tipAddTrigger1")} type="warning" />
          <div
            style={{ display: "flex", justifyContent: "center", marginTop: 10 }}
          >
            <Button
              type="primary"
              onClick={() => {
                setModalTrigger(true);
              }}
            >
              {t("trigger.btAddTrigger")}
            </Button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
        {saving ? (
          <Button
            style={{ width: "140px" }}
            block
            type="primary"
            danger
            loading
          >
            {t("common.btDeleting")}
          </Button>
        ) : (
          <Button
            style={{ width: "140px" }}
            block
            type="primary"
            danger
            onClick={() => {
              setModalDeleteRecipient(true);
            }}
          >
            {t("recipient.btDeleteRecipient")}
          </Button>
        )}
      </div>

      <Modal
        visible={modalEditRecipient}
        maskClosable={false}
        closable={false}
        onCancel={() => setModalEditRecipient(false)}
        onOk={() => {
          saveEditRecipient();
          setModalEditRecipient(false);
        }}
      >
        <Form>
          <Form.Item>
            <Input
              value={recipientName}
              onChange={(e) => {
                setRecipientName(e.target.value);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        visible={modalTrigger}
        maskClosable={false}
        closable={false}
        onCancel={() => setModalTrigger(false)}
        onOk={() => {
          onSaveTrigger();
        }}
      >
        <div>????????????????????????????????????????????????????????????????????????????????????</div>
        <div>??????????????????</div>
        <div>??????????????????</div>
        <Radio.Group
          options={[
            { label: "?????????", value: "TIMER_TYPE_PRIMARY" },
            { label: "????????????", value: "TIMER_TYPE_DATETIME" },
          ]}
          onChange={(e) => {
            setTriggerType(e.target.value);
          }}
          value={triggerType}
          optionType="button"
          buttonStyle="solid"
        />
        {triggerType === "TIMER_TYPE_PRIMARY" ? (
          <div>?????????????????????????????????????????????????????????????????????</div>
        ) : (
          <>
            <div>??????????????????????????????????????????????????????</div>
            <DatePicker
              showTime
              onChange={(e) => {
                dispatch(saveTriggerTime(e));
              }}
              onOk={(e) => {
                dispatch(saveTriggerTime(e));
              }}
            />
            <div>???????????????{moment(triggerTime).format("LLL")}</div>
          </>
        )}
      </Modal>

      <Modal
        visible={modalDeleteRecipient}
        closable={false}
        maskClosable={false}
        onCancel={() => setModalDeleteRecipient(false)}
        onOk={() => onDeleteRecipient()}
      >
        <p>{t("recipient.tipDeleteRecipient")}</p>
      </Modal>
    </div>
  );
};
export default SendDetail;
