import {
  Breadcrumb,
  Button,
  Card,
  Form,
  Input,
  message,
  Radio,
  RadioChangeEvent,
  Space,
  Spin,
  Tag,
} from "antd";
import FormItem from "antd/lib/form/FormItem";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiCreateMyQuadTask, apiRequestRsaPublicKey } from "../../../api/Api";
import { Encrypt, GenerateKey, RSAencrypt } from "../../../common/crypto";
import CryptoJS from "crypto-js";
const QuadrantTaskNew = () => {
  const [PROGRESS, setPROGRESS] = useState(false);
  const [COMPLETE, setCOMPLETE] = useState(false);
  const [title, setTitle] = useState("");
  const [editing, setEditing] = useState(false);
  const [taskImportant, setTaskImportant] = useState("IMPORTANT_AND_URGENT");
  const [importantAndUrgent, setImportantAndUrgent] = useState(true);
  const [importantNotUrgent, setImportantNotUrgent] = useState(true);
  const [urgentNotImportant, setUrgentNotImportant] = useState(true);
  const [nothing, setNothing] = useState(true);
  const { t } = useTranslation();
  const [modalDeleteTask, setModalDeleteTask] = useState(false);
  const [taskType, setTaskType] = useState("IMPORTANT_AND_URGENT");
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const onSaveTask = () => {
    if (!title) {
      message.error(t("task.tipNoTaskTitle"));
      return;
    }

    let params = {
      taskTitle: title,
      content: "",
      encryptKey: "",
      keyToken: "",
    };

    const key_UUID = GenerateKey();
    const key_UUID_256 = CryptoJS.SHA256(key_UUID);
    const key_UUID_256_base64 = CryptoJS.enc.Base64.stringify(key_UUID_256);
    params.content = Encrypt(content, key_UUID_256_base64, key_UUID_256_base64);
    params.encryptKey = key_UUID_256_base64;

    setSaving(true);
    apiRequestRsaPublicKey()
      .then((res1: any) => {
        if (res1.code === 0) {
          /**
           * 用服务器生成的RSA公钥来加密本地的AES秘钥key_UUID_256_base64
           */
          let ss = RSAencrypt(params.encryptKey, res1.data.publicKey) || "";
          params.encryptKey = ss;
          /**
           * 服务器端的RSA私钥对应的token
           */
          params.keyToken = res1.data.keyToken;

          apiCreateMyQuadTask(params)
            .then((res: any) => {
              if (res.code === 0) {
                message.success(t("task.tipSaveSuccess"));
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
        } else {
          message.error(t("syserr." + res1.code));
          setSaving(false);
        }
      })
      .catch(() => {
        message.error(t("syserr.10001"));
        setSaving(false);
      });
  };

  return (
    <div style={{}}>
      <Breadcrumb style={{}}>
        <Breadcrumb.Item>
          <a href="/main/QuadrantTaskList">
            <span style={{ color: themeColor.textLight }}>
              {t("nav.myQuadTask")}
            </span>
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span style={{ color: themeColor.textLight }}>
            {t("nav.myQuadTaskEdit")}
          </span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ marginTop: 20 }}></div>
      <Card style={{ background: themeColor.blockDark }}>
        {PROGRESS ? <Tag color="blue">{t("common.PROGRESS")}</Tag> : null}
        {COMPLETE ? <Tag color="success">{t("common.COMPLETE")}</Tag> : null}
        <Form>
          <FormItem>
            <div style={{ color: themeColor.textLight }}>
              {" "}
              {t("task.taskTitle")}
            </div>
            <Input
              style={{
                background: themeColor.blockLight,
                color: themeColor.textDark,
              }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("task.titleHolder")}
            />
          </FormItem>
          <FormItem>
            <Radio.Group
              onChange={(e: RadioChangeEvent) => {
                setTaskType(e.target.value);
              }}
              value={taskType}
            >
              <Space direction="vertical">
                <Radio value={"IMPORTANT_AND_URGENT"}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      height: "30px",
                      color: themeColor.textLight,
                    }}
                  >
                    <div>{t("task.IMPORTANT_AND_URGENT")}</div>
                    {taskType === "IMPORTANT_AND_URGENT" ? (
                      <div style={{ marginLeft: 20 }}>
                        <Tag color="#cf1322">{t("task.tip1")}</Tag>
                      </div>
                    ) : null}
                  </div>
                </Radio>
                <Radio value={"IMPORTANT_NOT_URGENT"}>
                  <div
                    style={{
                      display: "flex",
                      height: "30px",
                      color: themeColor.textLight,
                    }}
                  >
                    <div>{t("task.IMPORTANT_NOT_URGENT")}</div>
                    {taskType === "IMPORTANT_NOT_URGENT" ? (
                      <div style={{ marginLeft: 20 }}>
                        <Tag color="#096dd9">{t("task.tip2")}</Tag>
                      </div>
                    ) : null}
                  </div>
                </Radio>
                <Radio value={"URGENT_NOT_IMPORTANT"}>
                  <div
                    style={{
                      display: "flex",
                      height: "30px",
                      color: themeColor.textLight,
                    }}
                  >
                    <div>{t("task.URGENT_NOT_IMPORTANT")}</div>
                    {taskType === "URGENT_NOT_IMPORTANT" ? (
                      <div style={{ marginLeft: 20 }}>
                        <Tag color="#d4b106">{t("task.tip3")}</Tag>
                      </div>
                    ) : null}
                  </div>
                </Radio>
                <Radio value={"NOTHING"}>
                  <div
                    style={{
                      display: "flex",
                      height: "30px",
                      color: themeColor.textLight,
                    }}
                  >
                    <div>{t("task.NOTHING")}</div>
                    {taskType === "NOTHING" ? (
                      <div style={{ marginLeft: 20 }}>
                        <Tag color="#8c8c8c">{t("task.tip4")}</Tag>
                      </div>
                    ) : null}
                  </div>
                </Radio>
              </Space>
            </Radio.Group>
          </FormItem>
          <FormItem>
            <div style={{ color: themeColor.textLight }}>
              {" "}
              {t("task.content")}
            </div>
            <Input.TextArea
              style={{
                background: themeColor.blockDark,
                color: themeColor.textLight,
              }}
              autoSize={{ minRows: 3 }}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          </FormItem>
        </Form>
      </Card>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        {saving ? (
          <Spin></Spin>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Button
              type="primary"
              style={{ width: "140px" }}
              onClick={() => onSaveTask()}
            >
              {t("task.btSave")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuadrantTaskNew;
