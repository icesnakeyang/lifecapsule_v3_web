import { useState } from "react";
import { Button, Form, Input, message, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { apiRegister } from "../../api/Api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { t } = useTranslation();
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const onRegister = () => {
    let params = {
      loginName,
      password,
    };
    setSaving(true);
    apiRegister(params)
      .then((res: any) => {
        if (res.code === 0) {
          message.success(t("login.tipRegisterSuccess"));
          navigate("/main/dashboard");
        } else {
          message.success(t("syserr." + res.code));
          setSaving(false);
        }
      })
      .catch(() => {
        message.error(t("syserr.10001"));
        setSaving(false);
      });
  };
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div style={{ margin: 10 }}>
        <Typography.Title level={3}>{t("login.greeting3")}</Typography.Title>
        <Typography.Paragraph>{t("login.greeting2")}</Typography.Paragraph>
      </div>
      <div>
        <Form style={{ marginTop: 10, width: "100%" }}>
          <Form.Item>
            <Input
              prefix={<UserOutlined />}
              placeholder={t("login.loginNameHolder")}
              onChange={(text) => {
                setLoginName(text.target.value);
              }}
            ></Input>
          </Form.Item>
          <Form.Item>
            <Input
              prefix={<LockOutlined />}
              placeholder={t("login.passwordHolder")}
              type="password"
              onChange={(text) => {
                setPassword(text.target.value);
              }}
            />
          </Form.Item>
          <Form.Item>
            <Input
              prefix={<LockOutlined />}
              placeholder={t("login.password2Holder")}
              type="password"
              onChange={(text) => {
                setPassword2(text.target.value);
              }}
            />
          </Form.Item>
          <Form.Item>
            {saving ? (
              <Button type="primary" loading block>
                {t("login.btRegistering")}
              </Button>
            ) : (
              <Button
                type="primary"
                block
                onClick={() => {
                  if (!loginName) {
                    message.error(t("login.tipNoLoginName"));
                    return;
                  }
                  if (!password) {
                    message.error(t("login.tipNoPassword"));
                    return;
                  }
                  if (!password2) {
                    message.error(t("login.tipNoPassword2"));
                    return;
                  }
                  if (password !== password2) {
                    message.error(t("login.tipNoPassword3"));
                    return;
                  }
                  onRegister();
                }}
              >
                {t("login.btRegister")}
              </Button>
            )}
          </Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <a href="/">{t("login.btSignIn")}</a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
