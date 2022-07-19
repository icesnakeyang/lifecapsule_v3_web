import { Breadcrumb, Button, Card, Col, List, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { apiListMyContact } from "../../api/Api";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveContactList } from "../../store/contactSlice";
import moment from "moment";

const ContactList = () => {
  const { t } = useTranslation();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const contactList = useSelector(
    (state: any) => state.contactSlice.contactList
  );

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
        style={{ background: "#fff" }}
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
          <Row style={{}}>
            <Col offset="1">{item.contactName}</Col>
            <Col offset="1">{item.phone}</Col>
            <Col offset="1">{item.email}</Col>
          </Row>
        </div>
      </List.Item>
    );
  };

  return (
    <div style={{}}>
      <Breadcrumb style={{ margin: "20px 0" }}>
        <Breadcrumb.Item>
          <a href="/main/dashboard">{t("common.home")}</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{t("contact.contactList")}</Breadcrumb.Item>
      </Breadcrumb>

      <Card>
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
