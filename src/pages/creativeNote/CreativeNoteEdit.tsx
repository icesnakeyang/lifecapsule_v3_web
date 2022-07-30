import { InfoCircleOutlined } from "@ant-design/icons";
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Spin,
} from "antd";
import FormItem from "antd/lib/form/FormItem";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Decrypt,
  Decrypt2,
  Encrypt,
  GenerateKey,
  GenerateRandomString16,
  RSAencrypt,
} from "../../common/crypto";
import MyEditor from "../components/MyEditor/MyEditor";
import CryptoJS from "crypto-js";
import {
  apiDeleteMyNote,
  apiGetMyCreativeNote,
  apiRequestRsaPublicKey,
  apiSaveCreativeNote,
} from "../../api/Api";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearDetail,
  saveDetail1,
  saveDetail2,
  saveDetail3,
} from "../../store/creativeNoteSlice";
import { getAllJSDocTagsOfKind } from "typescript";
const CreativeNoteEdit = () => {
  const [loading, setLoading] = useState(true);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteCreateTime, setNoteCreateTime] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalDeleteNote, setModalDeleteNote] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { noteId }: any = useLocation().state || "";
  const [note, setNote] = useState(null);
  const dispatch = useDispatch();
  const detail1 = useSelector((state: any) => state.creativeNoteSlice.detail1);
  const detail2 = useSelector((state: any) => state.creativeNoteSlice.detail2);
  const detail3 = useSelector((state: any) => state.creativeNoteSlice.detail3);
  const [deleting, setDeleting] = useState(false);
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);

  useEffect(() => {
    if (noteId) {
      loadAllData();
    } else {
      setLoading(false);
      dispatch(clearDetail());
    }
    return () => {};
  }, []);

  const loadAllData = () => {
    let params = {
      noteId,
      encryptKey: {},
      keyToken: "",
    };
    setLoading(true);
    apiRequestRsaPublicKey()
      .then((res1: any) => {
        if (res1.code === 0) {
          const keyAES_1 = GenerateRandomString16();
          params.encryptKey = RSAencrypt(keyAES_1, res1.data.publicKey);
          params.keyToken = res1.data.keyToken;
          apiGetMyCreativeNote(params)
            .then((res2: any) => {
              if (res2.code === 0) {
                setNote(res2.data.note);
                let strKey = res2.data.note.userEncodeKey;
                strKey = Decrypt2(strKey, keyAES_1);
                for (let i = 0; i < res2.data.creativeNoteList.length; i++) {
                  if (
                    res2.data.creativeNoteList[i].creativeType === "CREATIVE1"
                  ) {
                    if (res2.data.creativeNoteList[i].content) {
                      let d1 = Decrypt(
                        res2.data.creativeNoteList[i].content,
                        strKey,
                        strKey
                      );
                      dispatch(saveDetail1(d1));
                    }
                  }
                  if (
                    res2.data.creativeNoteList[i].creativeType === "CREATIVE2"
                  ) {
                    if (res2.data.creativeNoteList[i].content) {
                      let dd2 = Decrypt(
                        res2.data.creativeNoteList[i].content,
                        strKey,
                        strKey
                      );
                      dispatch(saveDetail2(dd2));
                    }
                  }
                  if (
                    res2.data.creativeNoteList[i].creativeType === "CREATIVE3"
                  ) {
                    if (res2.data.creativeNoteList[i].content) {
                      let dd3 = Decrypt(
                        res2.data.creativeNoteList[i].content,
                        strKey,
                        strKey
                      );
                      dispatch(saveDetail3(dd3));
                    }
                  }
                }
                setNoteTitle(res2.data.note.title);
                setNoteCreateTime(res2.data.note.createTime);
                setLoading(false);
              } else {
                message.error(t("syserr." + res2.code));
              }
            })
            .catch((e) => {
              message.error(t("syserr.10001"));
            });
        } else {
          message.error(t("syserr." + res1.code));
        }
      })
      .catch((e) => {
        message.error(t("syserr.10001"));
      });
  };

  const onConfirmDeleteNote = () => {
    let params = {
      noteId,
    };
    setDeleting(true);

    apiDeleteMyNote(params)
      .then((res: any) => {
        if (res.code === 0) {
          message.success(t("creativeNote.tipDeleteSuccess"));
          setModalDeleteNote(false);
          navigate(-1);
        } else {
          message.error(t("syserr." + res.code));
        }
      })
      .catch(() => {
        message.error(t("syserr.10001"));
      });
  };

  const onSaveCreativeNote = () => {
    if (!noteTitle) {
      message.error(t("creativeNote.tipNoTitle"));
      return;
    }
    const key_UUID = GenerateKey();
    const key_UUID_256 = CryptoJS.SHA256(key_UUID);
    const key_UUID_256_base64 = CryptoJS.enc.Base64.stringify(key_UUID_256);

    let params = {
      noteId,
      detail1,
      detail2,
      detail3,
      encryptKey: "",
      noteTitle,
      keyToken: "",
    };

    params.detail1 = Encrypt(detail1, key_UUID_256_base64, key_UUID_256_base64);
    params.detail2 = Encrypt(detail2, key_UUID_256_base64, key_UUID_256_base64);
    params.detail3 = Encrypt(detail3, key_UUID_256_base64, key_UUID_256_base64);
    setSaving(true);
    apiRequestRsaPublicKey()
      .then((res: any) => {
        if (res.code === 0) {
          params.encryptKey =
            RSAencrypt(key_UUID_256_base64, res.data.publicKey) || "";
          params.keyToken = res.data.keyToken;

          apiSaveCreativeNote(params)
            .then((response: any) => {
              if (response.code === 0) {
                message.success(t("creativeNote.tipSaveSuccess"));
                navigate(-1);
              } else {
                message.error(t("syserr." + response.code));
                setSaving(false);
              }
            })
            .catch(() => {
              message.error(t("syserr.10001"));
              setSaving(false);
            });
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
    <div style={{}}>
      <Breadcrumb style={{}}>
        <Breadcrumb.Item>
          <a href="/main/dashboard">
            <span style={{ color: themeColor.textLight }}>{t("nav.home")}</span>
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span style={{ color: themeColor.textLight }}>
            {t("nav.creativeNote")}
          </span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span style={{ color: themeColor.textLight }}>
            {t("creativeNote.editCreativeNote")}
          </span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ marginTop: 20 }}></div>
      <Alert message={t("creativeNote.tipCreativeNote")} type="info" />
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
          <div style={{ marginTop: 20 }}>
            <Form>
              <FormItem>
                <div style={{ color: themeColor.textLight }}>
                  {t("note.title")}
                </div>
                <Input.TextArea
                  style={{
                    background: themeColor.blockDark,
                    color: themeColor.textLight,
                  }}
                  value={noteTitle}
                  placeholder={t("creativeNote.titleHolder")}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  autoSize={true}
                />
              </FormItem>
              <p style={{ color: themeColor.textLight }}>
                {t("note.createTime")}：
                {noteCreateTime ? moment(noteCreateTime).format("LLL") : null}
              </p>
            </Form>
          </div>
          <Card
            style={{
              color: themeColor.textLight,
              background: themeColor.blockDark,
            }}
            title={t("creativeNote.title1")}
            headStyle={{ color: themeColor.textLight }}
          >
            <div style={{ fontSize: 10, color: themeColor.textHolder }}>
              {t("creativeNote.tipTitle1")}
            </div>
            <div style={{ border: "1px solid #ccc", padding: 5 }}>
              <MyEditor type="CREATIVE_NOTE1" />
            </div>
          </Card>
          <Card
            style={{ marginTop: 10, background: themeColor.blockDark }}
            title={t("creativeNote.title2")}
            headStyle={{ color: themeColor.textLight }}
          >
            <div style={{ fontSize: 10, color: themeColor.textHolder }}>
              {t("creativeNote.tipTitle2")}
            </div>
            <div
              style={{
                border: "1px solid #ccc",
                padding: 5,
                color: themeColor.textLight,
              }}
            >
              <MyEditor type="CREATIVE_NOTE2" />
            </div>
          </Card>
          <Card
            style={{ marginTop: 10, background: themeColor.blockDark }}
            title={t("creativeNote.title3")}
            headStyle={{ color: themeColor.textLight }}
          >
            <div style={{ fontSize: 10, color: themeColor.textHolder }}>
              {t("creativeNote.tipTitle3")}
            </div>
            <div
              style={{
                border: "1px solid #ccc",
                padding: 5,
                color: themeColor.textLight,
              }}
            >
              <MyEditor type="CREATIVE_NOTE3" />
            </div>
          </Card>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <div>
              {saving ? (
                <Button style={{ width: "140px" }} type="primary" loading>
                  {t("common.btSaving")}
                </Button>
              ) : (
                <Button
                  style={{ width: "140px" }}
                  type="primary"
                  onClick={onSaveCreativeNote}
                >
                  {t("common.btSave")}
                </Button>
              )}
            </div>
            <div>
              <Button
                style={{ width: "140px", marginLeft: 60 }}
                danger
                type="primary"
                onClick={() => setModalDeleteNote(true)}
              >
                {t("common.btDelete")}
              </Button>
            </div>
          </div>
        </>
      )}

      <Modal
        visible={modalDeleteNote}
        closable={false}
        maskClosable={false}
        title={t("creativeNote.tipDelete1")}
        onOk={onConfirmDeleteNote}
        onCancel={() => setModalDeleteNote(false)}
      >
        {deleting ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Spin tip={t("common.btDeleting")}></Spin>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ fontSize: 24, color: "red" }}>
              <InfoCircleOutlined />
            </div>
            <div style={{ marginLeft: 10, color: "red" }}>
              {t("creativeNote.tipDelete2")}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default CreativeNoteEdit;
