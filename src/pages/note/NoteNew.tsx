import {  useState } from "react";
import { Breadcrumb, Button, Form, Input, message, Radio, Select } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveNoteCategoryCurrent } from "../../store/noteDataSlice";
import { apiRequestRsaPublicKey, apiSaveMyNote } from "../../api/Api";
import { Encrypt, GenerateKey, RSAencrypt } from "../../common/crypto";
import CryptoJS from "crypto-js";
import { EditOutlined } from "@ant-design/icons";
import MyEditor from "../components/MyEditor/MyEditor";
const NoteNew = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const currentCategoryId = useSelector(
    (state: any) => state.noteDataSlice.currentCategoryId
  );
  const categoryList = useSelector(
    (state: any) => state.noteDataSlice.categoryList
  );
  const richContent =
    useSelector((state: any) => state.commonSlice.richContent) || "";
  const dispatch = useDispatch();
  const [encrypt, setEncrypt] = useState(1);
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);

  const onSaveNote = () => {
    let params = {
      title,
      categoryId: currentCategoryId,
      encrypt,
      content: "",
      encryptKey: "",
      keyToken: "",
    };
    setSaving(true);
    if (encrypt === 1) {
      /**
       * 加密保存
       */
      const uuid = GenerateKey();
      const keyAES = CryptoJS.SHA256(uuid);
      const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
      params.content = Encrypt(richContent, keyAESBase64, keyAESBase64);
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
                  navigate("/main/NoteList");
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
      apiSaveMyNote(params)
        .then((res: any) => {
          if (res.code === 0) {
            message.success(t("note.tipNoteSaveSuccess"));
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
    }
  };

  return (
    <div>
      <Breadcrumb style={{ margin: "20px 0" }}>
        <Breadcrumb.Item>
          <a href="/main/dashboard">
            <span style={{ color: themeColor.textLight }}>
              {t("common.home")}
            </span>
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/main/noteList">
            <span style={{ color: themeColor.textLight }}>
              {t("note.noteList")}
            </span>
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span style={{ color: themeColor.textLight }}>
            {t("note.noteNew")}
          </span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Select
        style={{ width: "200px", marginTop: 10 }}
        defaultValue={currentCategoryId}
        onSelect={(e: string) => {
          dispatch(saveNoteCategoryCurrent(e));
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
      <Form style={{ marginTop: 20 }} layout='vertical'>
        <Form.Item>
            <div style={{color:themeColor.textLight}}>{t('note.title')}</div>
          <Input
            style={{
              background: themeColor.blockDark,
              color: themeColor.textLight,
            }}
            placeholder={t("note.titleHolder")}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item>
            <div style={{color:themeColor.textLight}}>{t('note.content')}</div>
          <div
            style={{
              background: themeColor.blockDark,
              color: themeColor.textLight,
              border: "1px solid #ccc",
              padding: 5,
            }}
          >
            <MyEditor type="NORMAL" />
          </div>
        </Form.Item>
        <Form.Item>
          <Radio.Group
            onChange={() => {
              if (encrypt === 1) {
                setEncrypt(0);
              } else {
                setEncrypt(1);
              }
            }}
            value={encrypt}
          >
            <Radio value={1}>
              <span style={{ color: themeColor.textLight }}>
                {t("note.encrypt")}
              </span>
            </Radio>
            <Radio value={0}>
              <span style={{ color: themeColor.textLight }}>
                {t("note.noEncrypt")}
              </span>
            </Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {saving ? (
          <Button style={{ width: "100px" }} type="primary" block loading>
            {t("common.btSaving")}
          </Button>
        ) : (
          <Button
            style={{ width: "100px" }}
            type="primary"
            block
            onClick={() => {
              onSaveNote();
            }}
          >
            {t("common.btSave")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default NoteNew;
