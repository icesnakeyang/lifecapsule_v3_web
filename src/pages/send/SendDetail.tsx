import {
  Alert,
  Button,
  Card,
  DatePicker,
  Divider,
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
  apiSaveRecipient,
} from "../../api/Api";
import { saveRecipient } from "../../store/recipinetSlice";
import { saveTrigger, saveTriggerTime } from "../../store/triggerSlice";
import { useTranslation } from "react-i18next";
import FormItem from "antd/lib/form/FormItem";

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
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [modalRecipientMessage, setModalRecipientMessage] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [fromName, setFromName] = useState("");
  const [toName, setToName] = useState("");
  const [description, setDescription] = useState("");
  const richContent = useSelector(
    (state: any) => state.commonSlice.richContent
  );

  useEffect(() => {
    loadAllData();
    return () => {};
  }, []);

  useEffect(() => {}, [recipientName]);

  const loadAllData = () => {
    let params = {
      recipientId,
    };
    apiGetRecipient(params)
      .then((res: any) => {
        if (res.code === 0) {
          dispatch(saveRecipient(res.data.recipient));
          setRecipientName(res.data.recipient.recipientName);
          setRecipientPhone(res.data.recipient.phone);
          setRecipientEmail(res.data.recipient.email);
          setMessageTitle(res.data.recipient.title);
          setFromName(res.data.recipient.fromName);
          setToName(res.data.recipient.toName);
          setDescription(res.data.recipient.description);
        }
      })
      .catch((e) => {});
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
      name: recipientName,
      recipientId,
      phone: recipientPhone,
      email: recipientEmail,
    };
    console.log(params);
    apiSaveRecipient(params)
      .then((res: any) => {
        if (res.code === 0) {
          loadAllData();
        } else {
          message.error(t("syserr." + res.code));
        }
      })
      .catch(() => {
        message.error(t("syserr.10001"));
      });
  };

  const onSaveRecipinet = () => {
    let params = {
      title: messageTitle,
      fromName,
      toName,
      description,
      recipientId,
    };
    console.log(params);
    apiSaveRecipient(params)
      .then((res: any) => {
        if (res.code === 0) {
          loadAllData();
          setModalRecipientMessage(false);
        } else {
          message.error(t("syserr." + res.code));
          setModalRecipientMessage(false);
        }
      })
      .catch(() => {
        message.error(t("syserr.10001"));
        setModalRecipientMessage(false);
      });
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
            style={{
              background: themeColor.blockDark,
              color: themeColor.textLight,
            }}
            headStyle={{ color: themeColor.textLight }}
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
              {t("recipient.recipientName")}：{recipient.recipientName}
            </p>
            <p>
              {t("recipient.recipientPhone")}：{recipient.phone}
            </p>
            <p>
              {t("recipient.recipientEmail")}：{recipient.email}
            </p>
          </Card>
        </>
      ) : null}
      {trigger ? (
        <>
          <Card
            style={{
              marginTop: 20,
              background: themeColor.blockDark,
              color: themeColor.textLight,
            }}
            headStyle={{ color: themeColor.textLight }}
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
                  <Tag style={{ fontSize: 16 }} color={themeColor.blockLight}>
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
                  <Tag style={{ fontSize: 16 }} color={themeColor.blockLight}>
                    {t("trigger.TIMER_TYPE_DATETIME")}
                  </Tag>
                  {t("trigger.tip6")}
                </div>
                <p>
                  {t("trigger.sendTime")}：
                  {moment(trigger.triggerTime).format("LLL")}
                </p>
              </>
            )}
          </Card>
          <Card
            title={t("recipient.recipientMessagePreview")}
            style={{
              marginTop: 20,
              background: themeColor.blockDark,
              color: themeColor.textLight,
            }}
            headStyle={{ color: themeColor.textLight }}
            extra={
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  setModalRecipientMessage(true);
                }}
              >
                {t("common.btEdit")}
              </Button>
            }
          >
            <div
              style={{
                fontSize: 24,
                width: "100%",
                textAlign: "center",
              }}
            >
              {recipient.title}
            </div>
            <div
              style={{
                margin: "10px 0",
                color: themeColor.textHolder,
                textAlign: "center",
              }}
            >
              {recipient.description}
            </div>
            <p>
              {t("recipient.messageTo")}：{recipient.toName}
            </p>
            <p>
              {t("recipient.messageFromName")}：{recipient.fromName}
            </p>
            <Divider style={{ background: themeColor.textLight }} />
            <div dangerouslySetInnerHTML={{ __html: richContent }}></div>
          </Card>
        </>
      ) : (
        <div style={{ marginTop: 10 }}>
          <Alert message={t("trigger.tipAddTrigger1")} type="warning" />
          <div style={{ display: "flex", marginTop: 20 }}>
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
        bodyStyle={{
          background: themeColor.blockDark,
          padding: 20,
          color: "red",
        }}
      >
        <Card
          title={t("recipient.editRecipient")}
          style={{ background: themeColor.blockDark }}
          headStyle={{ color: themeColor.textLight }}
        >
          <Form>
            <Form.Item>
              <div style={{ color: themeColor.textLight }}>
                {t("recipient.recipientName")}
              </div>
              <Input
                style={{
                  background: themeColor.blockLight,
                  color: themeColor.textDark,
                }}
                value={recipientName}
                onChange={(e) => {
                  setRecipientName(e.target.value);
                }}
              />
            </Form.Item>
            <FormItem>
              <div style={{ color: themeColor.textLight }}>
                {t("recipient.recipientPhone")}
              </div>
              <Input
                style={{
                  background: themeColor.blockLight,
                  color: themeColor.textDark,
                }}
                value={recipientPhone}
                onChange={(e) => {
                  setRecipientPhone(e.target.value);
                }}
              />
            </FormItem>
            <FormItem>
              <div style={{ color: themeColor.textLight }}>
                {t("recipient.recipientEmail")}
              </div>
              <Input
                style={{
                  background: themeColor.blockLight,
                  color: themeColor.textDark,
                }}
                value={recipientEmail}
                onChange={(e) => {
                  setRecipientEmail(e.target.value);
                }}
              />
            </FormItem>
          </Form>
        </Card>
      </Modal>

      <Modal
        visible={modalTrigger}
        maskClosable={false}
        closable={false}
        onCancel={() => setModalTrigger(false)}
        onOk={() => {
          onSaveTrigger();
        }}
        bodyStyle={{
          background: themeColor.blockDark,
          color: themeColor.textLight,
        }}
      >
        <Card
          title={t("trigger.editTrigger")}
          style={{
            background: themeColor.blockDark,
            color: themeColor.textLight,
          }}
          headStyle={{ color: themeColor.textLight }}
        >
          <div style={{ marginTop: 10 }}>{t("trigger.tipTrigger1")}</div>
          <br />
          <Radio.Group
            options={[
              {
                label: t("trigger.TIMER_TYPE_PRIMARY"),
                value: "TIMER_TYPE_PRIMARY",
              },
              {
                label: t("trigger.TIMER_TYPE_DATETIME"),
                value: "TIMER_TYPE_DATETIME",
              },
            ]}
            onChange={(e) => {
              setTriggerType(e.target.value);
            }}
            value={triggerType}
            optionType="button"
            buttonStyle="solid"
          />
          {triggerType === "TIMER_TYPE_PRIMARY" ? (
            <div style={{ marginTop: 10 }}>{t("trigger.tip5")}</div>
          ) : (
            <>
              <div style={{ marginTop: 10 }}>{t("trigger.tip6")}</div>
              <DatePicker
                style={{ marginTop: 10 }}
                showTime
                onChange={(e) => {
                  dispatch(saveTriggerTime(e));
                }}
                onOk={(e) => {
                  dispatch(saveTriggerTime(e));
                }}
              />
              <div>
                {t("trigger.sendTime")}：{moment(triggerTime).format("LLL")}
              </div>
            </>
          )}
        </Card>
      </Modal>

      <Modal
        bodyStyle={{
          background: themeColor.blockDark,
          padding: 20,
          color: themeColor.textLight,
        }}
        visible={modalDeleteRecipient}
        closable={false}
        maskClosable={false}
        onCancel={() => setModalDeleteRecipient(false)}
        onOk={() => onDeleteRecipient()}
      >
        <div style={{}}>
          <p>{t("recipient.tipDeleteRecipient")}</p>
        </div>
      </Modal>

      <Modal
        visible={modalRecipientMessage}
        onCancel={() => setModalRecipientMessage(false)}
        bodyStyle={{ background: themeColor.blockDark }}
        closable={false}
        maskClosable={false}
        onOk={() => {
          onSaveRecipinet();
        }}
      >
        <Card
          title={t("recipient.editRecipientMessage")}
          headStyle={{ color: themeColor.textLight }}
          style={{ background: themeColor.blockDark }}
        >
          <Form>
            <Form.Item>
              <div style={{ color: themeColor.textLight, fontSize: 16 }}>
                {t("recipient.messageTitle")}
              </div>
              <Input
                style={{
                  background: themeColor.blockDark,
                  color: themeColor.textLight,
                }}
                onChange={(e) => {
                  setMessageTitle(e.target.value);
                }}
                value={messageTitle}
              />
              <div style={{ color: themeColor.textHolder }}>
                {t("recipient.tipMessageTitle")}
              </div>
            </Form.Item>
            <Form.Item>
              {/* from name */}
              <div style={{ color: themeColor.textLight, fontSize: 16 }}>
                {t("recipient.messageFromName")}
              </div>
              <Input
                style={{
                  background: themeColor.blockDark,
                  color: themeColor.textLight,
                }}
                onChange={(e) => {
                  setFromName(e.target.value);
                }}
                value={fromName}
              />
              <div style={{ color: themeColor.textHolder }}>
                {t("recipient.tipMessageFromName")}
              </div>
            </Form.Item>
            <Form.Item>
              <div style={{ color: themeColor.textLight, fontSize: 16 }}>
                {t("recipient.messageTo")}
              </div>
              <Input
                style={{
                  background: themeColor.blockDark,
                  color: themeColor.textLight,
                }}
                onChange={(e) => {
                  setToName(e.target.value);
                }}
                value={toName}
              />
              <div style={{ color: themeColor.textHolder }}>
                {t("recipient.tipMessageTo")}
              </div>
            </Form.Item>
            <Form.Item>
              <div style={{ color: themeColor.textLight, fontSize: 16 }}>
                {t("recipient.messageDescription")}
              </div>
              <Input
                style={{
                  background: themeColor.blockDark,
                  color: themeColor.textLight,
                }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                value={description}
              />
              <div style={{ color: themeColor.textHolder }}>
                {t("recipient.tipMessageDescription")}
              </div>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};
export default SendDetail;
