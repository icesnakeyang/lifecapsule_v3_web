import { useState } from "react";
import { Button, Form, Input, message, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { apiListMyNote, apiLogin } from "../../api/Api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  clearUserInfo,
  saveToken,
  saveUserInfo,
} from "../../store/userDataSlice";
import {
  clearNote,
  saveNoteCategoryCurrent,
  saveNoteCategoryList,
} from "../../store/noteDataSlice";
import { clearContact } from "../../store/contactSlice";

const Login = () => {
  const { t } = useTranslation();
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogin = () => {
    let params = {
      loginName,
      password,
    };
    setSaving(true);
    apiLogin(params)
      .then((res: any) => {
        if (res.code === 0) {
          message.success(t("login.tipLoginSuccess"));
          dispatch(clearUserInfo());
          dispatch(clearNote());
          dispatch(clearContact());
          dispatch(saveToken(res.data.token));
          dispatch(saveNoteCategoryCurrent(res.data.defaultCategoryId));
          dispatch(saveNoteCategoryList(res.data.categoryList));
          let userInfo = {
            loginName: res.data.loginName,
          };
          dispatch(saveUserInfo(userInfo));
          localStorage.setItem("lifecapsule3_token", res.data.token);
          navigate("/main/dashboard");
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
        <Typography.Title>{t("login.greeting1")}</Typography.Title>
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
              type="password"
              autoComplete="off"
              placeholder={t("login.passwordHolder")}
              onChange={(text) => {
                setPassword(text.target.value);
              }}
            />
          </Form.Item>
          <Form.Item>
            {saving ? (
              <Button type="primary" block loading>
                {t("login.btSignIning")}
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
                  onLogin();
                }}
              >
                {t("login.btSignIn")}
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
            <a href="/guest/register">{t("login.btRegister")}</a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
