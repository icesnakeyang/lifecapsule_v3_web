import {Breadcrumb, Button, Form, Input, message, Modal, Spin, Tag} from "antd";
import FormItem from "antd/lib/form/FormItem";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {apiCreateMyTaskTodo, apiGetMyTaskTodo, apiRequestRsaPublicKey, apiUpdateMyTaskTodo} from "../../api/Api";
import {useNavigate, useLocation} from "react-router-dom";
import {Decrypt, Decrypt2, Encrypt, GenerateKey, GenerateRandomString16, RSAencrypt} from "../../common/crypto";
import CryptoJS from "crypto-js";
import {use} from "i18next";
import {FolderOutlined} from "@ant-design/icons";
import {clearCurrentProject} from "../../store/projectSlice";

const TodoNew = () => {
    const {t} = useTranslation();
    const [todoTitle, setTodoTitle] = useState("");
    const [todoContent, setTodoContent] = useState("");
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
    const currentProjectId = useSelector((state: any) => state.projectSlice.currentProjectId)
    const currentProjectName = useSelector((state: any) => state.projectSlice.currentProjectName)

    const saveTodo = () => {
        let params = {
            title: todoTitle,
            content: todoContent,
            encryptKey: '',
            keyToken: '',
            projectId: currentProjectId
        };
        setSaving(true);
        const uuid = GenerateKey();
        const keyAES = CryptoJS.SHA256(uuid);
        const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
        params.content = Encrypt(params.content, keyAESBase64, keyAESBase64);
        params.encryptKey = keyAESBase64;
        apiRequestRsaPublicKey()
            .then((res1: any) => {
                if (res1.code === 0) {
                    params.encryptKey =
                        RSAencrypt(params.encryptKey, res1.data.publicKey) || "";
                    params.keyToken = res1.data.keyToken;
                    apiCreateMyTaskTodo(params)
                        .then((res: any) => {
                            if (res.code === 0) {
                                message.success(t("task.tipSaveSuccess"));
                                navigate(-1);
                            } else {
                                message.error(t("syserr." + res.code));
                            }
                        })
                        .catch(() => {
                            message.error(t("syserr.10001"));
                        });
                } else {
                    message.error(t("syserr." + res1.code));
                }
            }).catch(() => {
            message.error(t("syserr.10001"));
        })
    };

    return (
        <div>
            <Breadcrumb style={{margin: "20px 0"}}>
                <Breadcrumb.Item>
                    <a href="/main/TodoPage">
            <span style={{color: themeColor.textLight}}>
              {t("task.myTodoList")}
            </span>
                    </a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
          <span style={{color: themeColor.textLight}}>
            {t("task.todoEdit")}
          </span>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Form layout="vertical">
                <FormItem>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Button type='primary' icon={<FolderOutlined/>}
                                onClick={() => {
                                    navigate("/main/ProjectList")
                                }}
                        >{t('project.currentProject')}</Button>
                        {currentProjectName &&
                            <div style={{marginLeft: 10}}>
                                <Tag closable onClose={() => {
                                    dispatch(clearCurrentProject())
                                }}>{currentProjectName}</Tag>
                            </div>
                        }
                    </div>
                </FormItem>
                <FormItem>
                    <div style={{color: themeColor.textLight}}>
                        {t("task.title")}
                    </div>
                    <Input
                        style={{
                            background: themeColor.blockDark,
                            color: themeColor.textLight,
                        }}
                        placeholder={t("task.titleHolder")}
                        onChange={(e: any) => setTodoTitle(e.target.value)}
                        value={todoTitle}
                    />
                </FormItem>
                <FormItem>
                    <div style={{color: themeColor.textLight}}>
                        {t("task.content")}
                    </div>
                    <Input.TextArea
                        style={{
                            background: themeColor.blockDark,
                            color: themeColor.textLight,
                        }}
                        autoSize={{minRows: 3}}
                        value={todoContent}
                        onChange={(e) => {
                            setTodoContent(e.target.value);
                        }}
                    />
                </FormItem>
            </Form>
            <div style={{display: "flex", justifyContent: "center"}}>
                {saving ? (
                    <Button style={{width: "140px"}} block type="primary" loading>
                        {t("task.btSaving")}
                    </Button>
                ) : (
                    <Button
                        style={{width: "140px"}}
                        block
                        type="primary"
                        onClick={() => saveTodo()}
                    >
                        {t("task.btSave")}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default TodoNew;
