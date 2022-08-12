import { Breadcrumb, Button, Card, Col, List, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { apiListMyContact } from "../../api/Api";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveContactList } from "../../store/contactSlice";

const ContactList = () => {
  const { t } = useTranslation();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const contactList = useSelector(
    (state: any) => state.contactSlice.contactList
  );
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
        dispatch(saveContactList(res.data.contactList));
      }
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
              navigate("/main/contactEdit", {
                state: { contactId: item.contactId },
              });
            }}
          >
            {t("common.btDetail")}
          </Button>,
        ]}
      >
        <div
          style={{
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              paddingLeft: "20px",
            }}
          >
            <div style={{ color: themeColor.textLight }}>
              {item.contactName}
            </div>
            <div style={{ color: themeColor.textLight, marginLeft: "20px" }}>
              {item.phone}
            </div>
            <div style={{ color: themeColor.textLight, marginLeft: "20px" }}>
              {item.email}
            </div>
          </div>
        </div>
      </List.Item>
    );
  };

  return (
    <div style={{}}>
      <Breadcrumb style={{}}>
        <Breadcrumb.Item>
          <a href="/main/dashboard">
            <span style={{ color: themeColor.textLight }}>
              {t("common.home")}
            </span>
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span style={{ color: themeColor.textLight }}>
            {t("contact.contactList")}
          </span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card style={{ background: themeColor.blockDark }}>
        <Button
          type="primary"
          onClick={() => {
            navigate("/main/ContactEdit");
          }}
        >
          {t("contact.btNewContact")}
        </Button>
      </Card>

      <List
        style={{ marginTop: 10 }}
        dataSource={contactList}
        renderItem={(item) => _renderContact(item)}
      ></List>
    </div>
  );
};

export default ContactList;
