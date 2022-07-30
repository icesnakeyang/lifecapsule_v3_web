import {
  Breadcrumb,
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Radio,
  RadioChangeEvent,
  Space,
  Spin,
  Tag,
} from "antd";
import FormItem from "antd/lib/form/FormItem";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  apiDeleteQuadTask,
  apiGetMyQuadTask,
  apiRequestRsaPublicKey,
  apiSetMyTaskComplete,
  apiSetMyTaskProgress,
  apiUpdateMyQuadTask,
} from "../../../api/Api";
import {
  Decrypt,
  Decrypt2,
  Encrypt,
  GenerateKey,
  GenerateRandomString16,
  RSAencrypt,
} from "../../../common/crypto";
import { saveRichContent } from "../../../store/commonSlice";
import { saveTaskQuad } from "../../../store/taskQuadSlic";
import MyEditor from "../../components/MyEditor/MyEditor";
import CryptoJS from "crypto-js";

const QuadrantTaskEdit = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const richContent = useSelector(
    (state: any) => state.commonSlice.richContent
  );
  const [saving, setSaving] = useState(false);
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
  const [PROGRESS, setPROGRESS] = useState(false);
  const [COMPLETE, setCOMPLETE] = useState(false);
  const [taskType, setTaskType] = useState("");
  // const routeParams = useLocation() || null;
  const { taskId }: any = useLocation().state || null;
  const dispatch = useDispatch();
  const taskQuead = useSelector((state: any) => state.taskQuadSlice.taskQuead);
  const [loading, setLoading] = useState(false);
  const [taskImportant, setTaskImportant] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [modalDeleteTask, setModalDeleteTask] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // if (routeParams) {
    //   if (routeParams.state) {
    //     const { taskId }: any = routeParams.state;
    if (taskId) {
      loadAllData(taskId);
    }
    // }
    // }
    // return () => {};
  }, []);

  const loadAllData = (taskId: string) => {
    let params = {
      taskId,
      encryptKey: "",
      keyToken: "",
    };
    setLoading(true);
    apiRequestRsaPublicKey()
      .then((res1: any) => {
        if (res1.code === 0) {
          const keyAES_1 = GenerateRandomString16();
          let ss: any = RSAencrypt(keyAES_1, res1.data.publicKey);
          params.encryptKey = ss;
          params.keyToken = res1.data.keyToken;
          apiGetMyQuadTask(params)
            .then((res2: any) => {
              if (res2.code === 0) {
                let task = res2.data.taskQuad;
                setTitle(task.taskTitle);
                setTaskImportant(task.important);
                if (task.status === "PROGRESS") {
                  setPROGRESS(true);
                  setCOMPLETE(false);
                } else {
                  if (task.status === "COMPLETE") {
                    setCOMPLETE(true);
                    setPROGRESS(false);
                  }
                }
                setTaskStatus(task.status);
                let strKey = task.userEncodeKey;
                if (strKey) {
                  strKey = Decrypt2(strKey, keyAES_1);
                  let ss = Decrypt(task.content, strKey, strKey);
                  dispatch(saveRichContent(ss));
                }
                setLoading(false);
              } else {
                message.error(t("syserr." + res2.code));
              }
            })
            .catch(() => {
              message.error(t("syserr.10001"));
            });
        } else {
          message.error(t("syserr." + res1.code));
        }
      })
      .catch(() => {
        message.error(t("syserr.10001"));
      });
  };

  const onSaveTask = () => {
    setSaving(true);

    if (!taskImportant) {
      return;
    }
    if (!title) {
      message.error(t("task.tipTitle"));
      return;
    }
    let params = {
      taskTitle: title,
      important: taskImportant,
      taskId,
      content: "",
      encryptKey: "",
      keyToken: "",
    };
    setSaving(true);
    /**
     * 本地随机生成一个uuid作为钥匙：key_UUID
     */
    const key_UUID = GenerateKey();
    /**
     * 把这个key_UUID用SHA256算法转换成哈希值：key_UUID_256
     */
    const key_UUID_256 = CryptoJS.SHA256(key_UUID);
    /**
     * 把这个key_UUID_256转成base64格式
     */
    const key_UUID_256_base64 = CryptoJS.enc.Base64.stringify(key_UUID_256);

    /**
     * 用这个key_UUID_256_base64作为秘钥和补码，用AES算法加密笔记内容
     */
    let dd = Encrypt(richContent, key_UUID_256_base64, key_UUID_256_base64);
    params.content = dd;
    /**
     * key_UUID_256_base64秘钥需要保存到服务器上
     */
    params.encryptKey = key_UUID_256_base64;

    /**
     * 从服务器请求一个RSA公钥
     */
    apiRequestRsaPublicKey()
      .then((res1: any) => {
        if (res1.code === 0) {
          /**
           * 用服务器生成的RSA公钥来加密本地的AES秘钥key_UUID_256_base64
           */
          params.encryptKey =
            RSAencrypt(params.encryptKey, res1.data.publicKey) || "";
          /**
           * 服务器端的RSA私钥对应的token
           */
          params.keyToken = res1.data.keyToken;

          apiUpdateMyQuadTask(params)
            .then((res2: any) => {
              if (res2.code === 0) {
                message.success(t("task.tipSaveSuccess"));

                setSaving(false);
              } else {
                message.error(t("syserr." + res2.code));
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

  const onSetComplete = () => {
    if (taskStatus === "COMPLETE") {
      return;
    }
    let params = {
      taskId,
    };
    setSaving(true);
    apiSetMyTaskComplete(params)
      .then((res: any) => {
        if (res.code === 0) {
          loadAllData(taskId);
          setSaving(false);
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

  const onSetProgress = () => {
    if (taskStatus === "PROGRESS") {
      return;
    }
    let params = {
      taskId,
    };
    setSaving(true);
    apiSetMyTaskProgress(params)
      .then((res: any) => {
        if (res.code === 0) {
          loadAllData(taskId);
          setSaving(false);
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

  const onConfirmDeleteTask = () => {
    let params = {
      taskId: taskId,
    };
    setSaving(true);
    apiDeleteQuadTask(params)
      .then((res: any) => {
        if (res.code === 0) {
          message.success(t("task.tipDeleteSuccess"));
          navigate("/main/QuadrantTaskList");
        } else {
          message.error(t("syserr." + res.code));
          setSaving(false);
          setModalDeleteTask(false);
        }
      })
      .catch(() => {
        message.error(t("syserr.10001"));
        setSaving(false);
        setModalDeleteTask(false);
      });
  };

  return (
    <div>
      <Breadcrumb style={{ margin: "20px 0", color: "red" }}>
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

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 100,
          }}
        >
          <Spin></Spin>
        </div>
      ) : (
        <>
          <Card style={{ background: themeColor.blockDark }}>
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
                />
              </FormItem>
              <FormItem>
                <span style={{ color: themeColor.textLight }}>
                  {t("task.taskStatus")}
                </span>
                <span style={{ marginLeft: 20 }}>
                  {PROGRESS ? (
                    <Tag color="blue">{t("common.PROGRESS")}</Tag>
                  ) : null}
                  {COMPLETE ? (
                    <Tag color="success">{t("common.COMPLETE")}</Tag>
                  ) : null}
                </span>
              </FormItem>
              <FormItem>
                <Radio.Group
                  onChange={(e: RadioChangeEvent) => {
                    setTaskImportant(e.target.value);
                  }}
                  value={taskImportant}
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
                        {taskImportant === "IMPORTANT_AND_URGENT" ? (
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
                        {taskImportant === "IMPORTANT_NOT_URGENT" ? (
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
                        {taskImportant === "URGENT_NOT_IMPORTANT" ? (
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
                        {taskImportant === "NOTHING" ? (
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
                <div
                  style={{
                    background: themeColor.blockLight,
                    padding: 5,
                    color: themeColor.textDark,
                  }}
                >
                  <MyEditor type="NORMAL" />
                </div>
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
                <Button type="primary" onClick={() => onSetProgress()}>
                  {t("task.setProgress")}
                </Button>
                <Button
                  type="primary"
                  style={{ background: "green" }}
                  onClick={() => onSetComplete()}
                >
                  {t("task.setComplete")}
                </Button>
                <Button
                  danger
                  type="primary"
                  style={{ width: "140px" }}
                  onClick={() => setModalDeleteTask(true)}
                >
                  {t("task.btDeleteTask")}
                </Button>
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
        </>
      )}

      <Modal
        visible={modalDeleteTask}
        title={t("task.tipDelete1")}
        maskClosable={false}
        onCancel={() => setModalDeleteTask(false)}
        onOk={() => onConfirmDeleteTask()}
      >
        {saving ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Spin></Spin>
          </div>
        ) : (
          <div>{t("task.tipDelete2")}</div>
        )}
      </Modal>
    </div>
  );
};

export default QuadrantTaskEdit;
