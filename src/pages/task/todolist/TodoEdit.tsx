import {Breadcrumb, Button, Form, Input, message, Modal, Spin} from "antd";
import FormItem from "antd/lib/form/FormItem";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {apiGetMyTaskTodo, apiRequestRsaPublicKey, apiUpdateMyTaskTodo} from "../../../api/Api";
import {useNavigate, useLocation} from "react-router-dom";
import {Decrypt, Decrypt2, GenerateRandomString16, RSAencrypt} from "../../../common/crypto";

const TodoEdit = () => {
    const {taskId}: any = useLocation().state;
    const {t} = useTranslation();
    const [todoTitle, setTodoTitle] = useState("");
    const [todoContent, setTodoContent] = useState("");
    const [modalDelete, setModalDelete] = useState(false);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);

    useEffect(() => {
        if (taskId) {
            //修改
            loadAllData();
        } else {
            //新增
            setLoading(false);
        }
        return () => {
        };
    }, [taskId]);

    const loadAllData = () => {
        let params = {
            taskId,
            encryptKey: {},
            keyToken: "",
        };
        apiRequestRsaPublicKey().then((res1: any) => {
            if (res1.code === 0) {
                const keyAES_1 = GenerateRandomString16();
                params.encryptKey = RSAencrypt(keyAES_1, res1.data.publicKey);
                params.keyToken = res1.data.keyToken;

                apiGetMyTaskTodo(params)
                    .then((res: any) => {
                        if (res.code === 0) {
                            setTodoTitle(res.data.taskTodo.taskTitle);
                            let content = res.data.taskTodo.content;
                            let strKey = res.data.taskTodo.userEncodeKey;
                            strKey = Decrypt2(strKey, keyAES_1);
                            content = Decrypt(content, strKey, strKey);
                            setTodoContent(content);
                            setLoading(false);
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

    const saveTodo = () => {
        let params = {
            title: todoTitle,
            content: todoContent,
            taskId,
        };

        setSaving(true);
        apiUpdateMyTaskTodo(params)
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
    };

    const deleteTodo = () => {
        setTimeout(() => {
        }, 100);
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

            {loading ? (
                <div
                    style={{
                        marginTop: "100px",
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                    }}
                >
                    <Spin/>
                </div>
            ) : (
                <>
                    <Form layout="vertical">
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
                </>
            )}

            <Modal
                visible={modalDelete}
                onCancel={() => setModalDelete(false)}
                maskClosable={false}
                closable={false}
                onOk={() => deleteTodo()}
            ></Modal>
        </div>
    );
};

export default TodoEdit;
