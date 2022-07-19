import { Breadcrumb, Button, Form, Input, message, Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  apiDeleteMyContact,
  apiGetMyContact,
  apiSaveMyContact,
} from "../../api/Api";
import { useLocation, useNavigate } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import MyEditor from "../MyEditor";
import { saveEditing, saveRichContent } from "../../store/commonSlice";

const ContactEdit = (props: any) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [remark, setRemark] = useState("");
  const [saving, setSaving] = useState(false);
  const { contactId }: any = useLocation().state || { contactId: null };
  const [modalDelete, setModalDelete] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [canDelete, setCanDelete] = useState(false);
  const content = useSelector((state: any) => state.commonSlice.richContent);
  const editingRedux = useSelector((state: any) => state.commonSlice.editing);

  useEffect(() => {
    return () => {
      if (contactId) {
        loadAllData();
      } else {
        setLoading(false);
      }
    };
  }, [contactId]);

  const loadAllData = () => {
    let params = {
      contactId,
    };
    setLoading(true);
    apiGetMyContact(params)
      .then((res: any) => {
        if (res.code === 0) {
          setContactName(res.data.contact.contactName);
          setPhone(res.data.contact.phone);
          setEmail(res.data.contact.email);
          setRemark(res.data.contact.remark);
          dispatch(saveRichContent(res.data.contact.remark));
          setCanDelete(true);
        }
        setLoading(false);
      })
      .catch(() => {
        message.error(t("syserr.10001"));
        setLoading(false);
      });
  };

  const onSaveContact = () => {
    let params = {
      contactName,
      phone,
      email,
      remark: content,
      contactId,
    };
    setSaving(true);
    apiSaveMyContact(params)
      .then((res: any) => {
        if (res.code === 0) {
          message.success(t("contact.tipContactSaveSuccess"));
          setSaving(false);
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

  const onConfirmDeleteContact = () => {
    let params = {
      contactId,
    };
    apiDeleteMyContact(params)
      .then((res: any) => {
        if (res.code === 0) {
          message.success(t("contact.tipDeleteSuccess"));
          navigate(-1);
        } else {
          message.error(t("syserr." + res.code));
        }
      })
      .catch(() => {
        message.error(t("syserr.10001"));
      });
  };

  return (
    <div style={{ height: "100%" }}>
      <Breadcrumb style={{ margin: "20px 0" }}>
        <Breadcrumb.Item>
          <a href="/main/dashboard">{t("common.home")}</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/main/contactList">{t("contact.contactList")}</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{t("contact.contactEdit")}</Breadcrumb.Item>
      </Breadcrumb>

      {loading ? (
        <div
          style={{
            marginTop: "100px",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Spin />
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
              alignItems: "center",
            }}
          >
            {canDelete ? (
              <Button
                type="primary"
                icon={<DeleteOutlined />}
                danger
                size="small"
                onClick={() => {
                  setModalDelete(true);
                }}
              >
                {t("common.btDelete")}
              </Button>
            ) : null}
          </div>
          <Form style={{ marginTop: 20 }} layout="vertical">
            <Form.Item label={t("contact.contactName")}>
              <Input
                placeholder={t("contact.contactNameHolder")}
                onChange={(e) => {
                  setContactName(e.target.value);
                  dispatch(saveEditing(editingRedux + 1));
                }}
                value={contactName}
              />
            </Form.Item>
            <Form.Item label={t("contact.contactPhone")}>
              <Input
                placeholder={t("contact.phoneHolder")}
                onChange={(e) => {
                  setPhone(e.target.value);
                  dispatch(saveEditing(editingRedux + 1));
                }}
                value={phone}
              />
            </Form.Item>
            <Form.Item label={t("contact.contactEmail")}>
              <Input
                placeholder={t("contact.emailHolder")}
                onChange={(e) => {
                  setEmail(e.target.value);
                  dispatch(saveEditing(editingRedux + 1));
                }}
                value={email}
              />
            </Form.Item>
            <Form.Item label={t("contact.contactRemark")}>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #ccc",
                  padding: 10,
                  minHeight: "100px",
                }}
              >
                <MyEditor data={remark} />
              </div>
            </Form.Item>
          </Form>
          <div
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}
          >
            {saving ? (
              <Button style={{ width: "140px" }} type="primary" loading>
                {t("common.btSaving")}
              </Button>
            ) : editingRedux > 0 ? (
              <Button
                style={{ width: "140px" }}
                block
                type="primary"
                onClick={() => {
                  onSaveContact();
                }}
              >
                {t("contact.btSave")}
              </Button>
            ) : null}
          </div>
        </>
      )}

      <Modal
        visible={modalDelete}
        onOk={onConfirmDeleteContact}
        onCancel={() => {
          setModalDelete(false);
        }}
      >
        <p>{t("contact.tipModalDelete1")}</p>
      </Modal>
    </div>
  );
};

export default ContactEdit;
