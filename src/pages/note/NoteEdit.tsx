import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  apiDeleteMyNote,
  apiGetMyNote,
  apiRequestRsaPublicKey,
  apiSaveMyNote,
} from "../../api/Api";
import {
  Decrypt,
  Decrypt2,
  Encrypt,
  GenerateKey,
  GenerateRandomString16,
  RSAencrypt,
} from "../../common/crypto";
import { useDispatch, useSelector } from "react-redux";
import { saveNote, saveNoteCategoryCurrent } from "../../store/noteDataSlice";
import {
  Breadcrumb,
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SendOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import CryptoJS from "crypto-js";
import MyEditor from "../MyEditor";
import { saveEditing, saveRichContent } from "../../store/commonSlice";
const NoteEdit = () => {
  const { noteId }: any = useLocation().state;
  const [title, setTitle] = useState("");
  const [encrypt, setEncrypt] = useState(1);
  const dispatch = useDispatch();
  const [note, setNote] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const categoryList = useSelector(
    (state: any) => state.noteDataSlice.categoryList
  );
  const currentCategoryId = useSelector(
    (state: any) => state.noteDataSlice.currentCategoryId
  );
  const [editing, setEditing] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const content = useSelector((state: any) => state.commonSlice.richContent);
  const editingRedux = useSelector((state: any) => state.commonSlice.editing);

  useEffect(() => {
    return () => {
      loadAllData();
    };
  }, [noteId]);

  useEffect(() => {
    dispatch(saveEditing(0));
  }, []);

  useEffect(() => {
    if (editingRedux > 1) {
      setEditing(true);
    } else {
      setEditing(false);
    }
  }, [editingRedux]);

  const loadAllData = () => {
    let params = {
      noteId,
      encryptKey: {},
      keyToken: "",
    };
    setLoading(true);
    apiRequestRsaPublicKey().then((res: any) => {
      if (res.code === 0) {
        const keyAES_1 = GenerateRandomString16();
        params.encryptKey = RSAencrypt(keyAES_1, res.data.publicKey);
        params.keyToken = res.data.keyToken;

        apiGetMyNote(params).then((res: any) => {
          if (res.code === 0) {
            let note = res.data.note;
            setTitle(note.title);
            dispatch(saveNoteCategoryCurrent(note.categoryId));
            if (note.encrypt === 1) {
              let strKey = note.userEncodeKey;
              strKey = Decrypt2(strKey, keyAES_1);
              let content = Decrypt(note.content, strKey, strKey);
              setEncrypt(1);
              // note.content = content;
              dispatch(saveRichContent(content));
            } else {
              setEncrypt(0);
            }

            setLoading(false);
            // dispatch(saveNote(note));
          }
        });
      }
    });
  };

  const onSaveNote = () => {
    let params = {
      title,
      noteId,
      categoryId: currentCategoryId,
      encrypt: 1,
      content: "",
      encryptKey: "",
      keyToken: "",
    };
    setSaving(true);
    if (encrypt === 1) {
      /**
       * 1?????????0?????????
       */
      params.encrypt = 1;
      /**
       * ????????????
       */
      const uuid = GenerateKey();
      const keyAES = CryptoJS.SHA256(uuid);
      const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
      params.content = Encrypt(content, keyAESBase64, keyAESBase64);
      params.encryptKey = keyAESBase64;
      apiRequestRsaPublicKey()
        .then((res: any) => {
          if (res.code === 0) {
            params.encryptKey =
              RSAencrypt(params.encryptKey, res.data.publicKey) || "";
            params.keyToken = res.data.keyToken;
            apiSaveMyNote(params)
              .then((res: any) => {
                if (res.code === 0) {
                  message.success(t("note.tipNoteSaveSuccess"));
                  // this.$router.back()
                  setSaving(false);
                  setEditing(false);
                  dispatch(saveEditing(1));
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
            message.error(t("syserr." + res.code));
            setSaving(false);
          }
        })
        .catch(() => {
          message.error(t("syserr.10001"));
          setSaving(false);
        });
    } else {
      params.encrypt = 0;
      params.content = content;
      setSaving(true);
      apiSaveMyNote(params)
        .then((res: any) => {
          if (res.code === 0) {
            message.success(t("note.tipNoteSaveSuccess"));
          } else {
            message.error(t("syserr." + res.code));
          }
          setEditing(false);
          setSaving(false);
        })
        .catch(() => {
          message.error(t("syserr.10001"));
          setSaving(false);
        });
    }
    // apiSaveMyNote
  };

  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <Breadcrumb style={{ margin: "20px 0" }}>
        <Breadcrumb.Item>
          <a href="/main/dashboard">{t("common.home")}</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/main/noteList">{t("note.noteList")}</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{t("note.noteEdit")}</Breadcrumb.Item>
      </Breadcrumb>
      {loading || deleting ? (
        <div
          style={{
            height: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin />
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "0 20px",
            }}
          >
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => {
                navigate("/main/SendPage", { state: { noteId } });
              }}
            >
              {t("note.btSend")}
            </Button>
            <Button
              type="primary"
              danger
              style={{ marginLeft: "10px" }}
              icon={<DeleteOutlined />}
              onClick={() => {
                setModalDelete(true);
              }}
            >
              {t("common.btDelete")}
            </Button>
          </div>
          <div>
            <Form style={{ padding: 0, margin: 10, marginTop: 40 }}>
              <Form.Item>
                <div style={{ height: "100%", width: "100%" }}>
                  <Select
                    defaultValue={currentCategoryId}
                    style={{ width: "200px" }}
                    onSelect={(e: any) => {
                      dispatch(saveNoteCategoryCurrent(e));
                      if (currentCategoryId !== e) {
                        setEditing(true);
                      }
                    }}
                  >
                    {categoryList.map((item: any) => (
                      <Select.Option value={item.categoryId} key={item.ids}>
                        {item.categoryName}
                      </Select.Option>
                    ))}
                  </Select>
                  <Button
                    type="default"
                    icon={<EditOutlined />}
                    onClick={() => {
                      navigate("/main/NoteCategoryEdit");
                    }}
                  ></Button>
                </div>
              </Form.Item>
              <Form.Item>
                <Input
                  value={title}
                  placeholder={t("note.titleHolder")}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setEditing(true);
                  }}
                />
              </Form.Item>
              <Form.Item>
                {/* <div dangerouslySetInnerHTML={{ __html: content }} /> */}
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #ccc",
                    padding: "5px",
                  }}
                >
                  <MyEditor data={content} />
                </div>
              </Form.Item>
              <Form.Item>
                <Radio.Group
                  onChange={() => {
                    if (encrypt === 1) {
                      setEncrypt(0);
                      setEditing(true);
                    } else {
                      setEncrypt(1);
                      setEditing(true);
                    }
                  }}
                  value={encrypt}
                >
                  <Radio value={1}>{t("note.encrypt")}</Radio>
                  <Radio value={0}>{t("note.noEncrypt")}</Radio>
                </Radio.Group>
              </Form.Item>
              <div
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                {saving ? (
                  <Button type="primary" style={{ width: "100px" }} loading>
                    {t("common.btSaving")}
                  </Button>
                ) : (
                  <>
                    {editing ? (
                      <Button
                        style={{ width: "100px" }}
                        type="primary"
                        onClick={() => {
                          onSaveNote();
                        }}
                      >
                        {t("common.btSave")}
                      </Button>
                    ) : null}
                  </>
                )}
              </div>
            </Form>
          </div>
        </div>
      )}

      <Modal
        visible={modalDelete}
        closable={false}
        onOk={() => {
          let params = {
            noteId,
          };
          setDeleting(true);
          setModalDelete(false);
          apiDeleteMyNote(params)
            .then((res: any) => {
              if (res.code === 0) {
                message.success(t("note.tipNoteDeleteSuccess"));
                navigate(-1);
              } else {
                message.error(t("syserr." + res.code));
                setDeleting(false);
              }
            })
            .catch(() => {
              message.error(t("syserr.10001"));
              setDeleting(false);
            });
        }}
        onCancel={() => setModalDelete(false)}
      >
        <p>{t("note.tipNoteDelete")}</p>
      </Modal>
    </div>
  );
};
export default NoteEdit;
