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
import { useSelector } from "react-redux";

const ContactEdit = (props: any) => {
  const { t } = useTranslation();
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
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

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
          setRemark(res.data.contact.remark);
          setCanDelete(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onSaveContact = () => {
    let params = {
      contactName,
      phone,
      email,
      remark,
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
          setSaving(false);
        }
      })
      .catch(() => {
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
        }
      })
      .catch(() => {});
  };

  return (
    <div style={{ height: "100%" }}>
      <Breadcrumb style={{ margin: "20px 0" }}>
        <Breadcrumb.Item>
          <a href="/main/dashboard">
            <span style={{ color: themeColor.textLight }}>
              {t("common.home")}
            </span>
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/main/contactList">
            <span style={{ color: themeColor.textLight }}>
              {t("contact.contactList")}
            </span>
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span style={{ color: themeColor.textLight }}>
            {t("contact.contactEdit")}
          </span>
        </Breadcrumb.Item>
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
            <Form.Item>
              <div style={{ color: themeColor.textLight }}>
                {t("contact.contactName")}
              </div>
              <Input
                style={{
                  background: themeColor.blockDark,
                  color: themeColor.textLight,
                }}
                placeholder={t("contact.contactNameHolder")}
                onChange={(e) => {
                  setContactName(e.target.value);
                  setEditing(true);
                }}
                value={contactName}
              />
            </Form.Item>
            <Form.Item>
              <div style={{ color: themeColor.textLight }}>
                {t("contact.contactPhone")}
              </div>
              <Input
                style={{
                  background: themeColor.blockDark,
                  color: themeColor.textLight,
                }}
                placeholder={t("contact.phoneHolder")}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setEditing(true);
                }}
                value={phone}
              />
            </Form.Item>
            <Form.Item>
              <div style={{ color: themeColor.textLight }}>
                {t("contact.contactEmail")}
              </div>
              <Input
                style={{
                  background: themeColor.blockDark,
                  color: themeColor.textLight,
                }}
                placeholder={t("contact.emailHolder")}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEditing(true);
                }}
                value={email}
              />
            </Form.Item>
            <Form.Item>
              <div style={{ color: themeColor.textLight }}>
                {t("contact.contactRemark")}
              </div>
              <Input.TextArea
                style={{
                  background: themeColor.blockDark,
                  color: themeColor.textLight,
                }}
                autoSize={{ minRows: 3 }}
                value={remark}
                onChange={(e) => {
                  setRemark(e.target.value);
                  setEditing(true);
                }}
              />
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
            ) : editing ? (
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
