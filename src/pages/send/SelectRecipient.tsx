import {
  Button,
  Card,
  Col,
  Form,
  Input,
  List,
  message,
  Modal,
  Row,
} from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  apiAddContactToRecipient,
  apiListMyContact,
  apiSaveMyContact,
} from "../../api/Api";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useSelector } from "react-redux";
const SelectRecipient = () => {
  const { noteId }: any = useLocation().state;
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [modalEditRecipient, setModalEditRecipient] = useState(false);
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [editing, setEditing] = useState(false);
  const [remark, setRemark] = useState("");
  const [email, setEmail] = useState("");
  const [contactList, setContactList] = useState([]);
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);

  useEffect(() => {
    return () => {
      loadAllData();
    };
  }, []);

  const loadAllData = () => {
    let params = {
      pageIndex,
      pageSize,
    };
    apiListMyContact(params).then((res: any) => {
      if (res.code === 0) {
        setContactList(res.data.contactList);
      }
    });
  };

  const onSaveContact = () => {
    let params = {
      contactName,
      phone,
      email,
      remark,
    };
    apiSaveMyContact(params)
      .then((res: any) => {
        if (res.code === 0) {
          message.success(t("contact.tipContactSaveSuccess"));
        } else {
          message.error(t("syserr." + res.code));
        }
      })
      .catch(() => {
        message.error(t("syserr.10001"));
      });
  };

  const onAddContactToRecipient = (contactId: string) => {
    let params = {
      noteId,
      contactId,
    };
    apiAddContactToRecipient(params)
      .then((res: any) => {
        if (res.code === 0) {
          message.success(t("recipinet.tipAddSuccess"));
          navigate(-1);
        } else {
          message.error(t("syserr." + res.code));
        }
      })
      .catch(() => {
        message.error(t("syserr.10001"));
      });
  };

  const _renderContact = (item: any) => {
    return (
      <List.Item
        style={{ background: themeColor.blockDark }}
        actions={[
          <Button
            type="primary"
            size="small"
            onClick={() => {
              onAddContactToRecipient(item.contactId);
            }}
          >
            {t("recipient.btAddToRecipient")}
          </Button>,
        ]}
      >
        <Row style={{ width: "100%" }}>
          <Col>
            <span style={{ color: themeColor.textLight }}>
              {item.contactName}
            </span>
          </Col>
          <Col offset="1">
            <span style={{ color: themeColor.textLight }}>{item.phone}</span>
          </Col>
          <Col offset="1">
            <span style={{ color: themeColor.textLight }}>{item.email}</span>
          </Col>
          <Col
            style={{
              fontSize: "12px",
              color: "#ccc",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            offset="1"
          >
            <span style={{ color: themeColor.textLight }}>{item.remark}</span>
          </Col>
        </Row>
      </List.Item>
    );
  };

  return (
    <div>
      <Card style={{ background: themeColor.blockDark }}>
        {contactList.length === 0 ? (
          <div>{t("contact.tipAddContact1")}</div>
        ) : null}
        <Button
          type="primary"
          onClick={() => {
            setModalEditRecipient(true);
          }}
        >
          {t("contact.btNewContact")}
        </Button>
      </Card>
      <List
        style={{ marginTop: 10 }}
        size="small"
        itemLayout="horizontal"
        bordered={true}
        dataSource={contactList || []}
        renderItem={(item) => _renderContact(item)}
      />
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
            <Input
              placeholder={t("contact.contactNameHolder")}
              onChange={(e) => {
                setContactName(e.target.value);
                setEditing(true);
              }}
              value={contactName}
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder={t("contact.phoneHolder")}
              onChange={(e) => {
                setPhone(e.target.value);
                setEditing(true);
              }}
              value={phone}
            />
          </Form.Item>
          <Form.Item>
            <Input
              placeholder={t("contact.emailHolder")}
              onChange={(e) => {
                setEmail(e.target.value);
                setEditing(true);
              }}
              value={email}
            />
          </Form.Item>
          <Form.Item>
            <Input.TextArea
              placeholder={t("contact.remarkHolder")}
              autoSize={{ minRows: 3 }}
              onChange={(e) => {
                setRemark(e.target.value);
                setEditing(true);
              }}
              value={remark}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default SelectRecipient;
