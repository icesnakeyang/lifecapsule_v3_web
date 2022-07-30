import { Button, Card, Form, Input, message, Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  apiAddContactToRecipient,
  apiListMyContact,
  apiSaveMyContact,
} from "../../api/Api";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import RecipientRow from "./RecipientRow";
import { saveContactList, saveTotalContact } from "../../store/contactSlice";
import MyEditor from "../components/MyEditor/MyEditor";
import { getTimeMeasureUtils } from "@reduxjs/toolkit/dist/utils";
import {clearRichContent} from "../../store/commonSlice";

const SelectRecipient = () => {
  const { noteId }: any = useLocation().state;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [modalEditRecipient, setModalEditRecipient] = useState(false);
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [editing, setEditing] = useState(false);
  const [remark, setRemark] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const contactPageIndex =
    useSelector((state: any) => state.contactSlice.contactPageIndex) || 1;
  const contactPageSize =
    useSelector((state: any) => state.contactSlice.contactPageSize) || 10;
  const contactList =
    useSelector((state: any) => state.contactSlice.contactList) || [];
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
  const richContent = useSelector(
    (state: any) => state.commonSlice.richContent
  );
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    return () => {
      loadAllData();
    };
  }, [contactPageIndex]);

  const loadAllData = () => {
    let params = {
      pageIndex: contactPageIndex,
      pageSize: contactPageSize,
    };
    setLoading(true);
    apiListMyContact(params).then((res: any) => {
      if (res.code === 0) {
        dispatch(saveContactList(res.data.contactList));
        dispatch(saveTotalContact(res.data.totalContact));
        setLoading(false);
      }
    });
  };

  const onSaveContact = () => {
    let params = {
      contactName,
      phone,
      email,
      remark: richContent,
    };
    apiSaveMyContact(params)
      .then((res: any) => {
        if (res.code === 0) {
          message.success(t("contact.tipContactSaveSuccess"));
          loadAllData()
          setModalEditRecipient(false);
        } else {
          message.error(t("syserr." + res.code));
        }
      })
      .catch(() => {
        message.error(t("syserr.10001"));
      });
  };

  return (
    <div>
      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 100 }}
        >
          <Spin />
        </div>
      ) : (
        <>
          {contactList.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
                padding: 20,
              }}
            >
              <div style={{ color: themeColor.textLight }}>
                {t("contact.tipAddContact1")}
              </div>
              <div>
                <Button
                  style={{ marginTop: 20 }}
                  type="primary"
                  onClick={() => {
                    dispatch(clearRichContent())
                    setModalEditRecipient(true);
                  }}
                >
                  {t("contact.btNewContact")}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {contactList.map((item: any, index: any) => (
                <RecipientRow item={item} noteId={noteId} key={index} />
              ))}
            </>
          )}
        </>
      )}

      <Modal
        visible={modalEditRecipient}
        closable={false}
        maskClosable={false}
        onCancel={() => setModalEditRecipient(false)}
        onOk={() => {
          onSaveContact();
        }}
        bodyStyle={{ background: themeColor.blockDark }}
      >
        <Form style={{ marginTop: 20, background: themeColor.blockDark }}>
          <Form.Item>
            <div style={{ color: themeColor.textLight }}>
              {t("contact.contactName")}
            </div>
            <Input
                style={{background:themeColor.blockDark,color:themeColor.textLight}}
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
                style={{background:themeColor.blockDark,color:themeColor.textLight}}
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
                style={{background:themeColor.blockDark,color:themeColor.textLight}}
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
            <div
              style={{
                background: themeColor.blockDark,
                color: themeColor.textLight,
                border: "1px solid #ccc",
                padding: 10,
              }}
            >
              <MyEditor type="NORMAL" />
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default SelectRecipient;
