import {Breadcrumb, Button, Form, Input, message, Modal, Spin, Tag} from "antd";
import FormItem from "antd/lib/form/FormItem";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {apiGetMyTaskTodo, apiRequestRsaPublicKey, apiUpdateMyTaskTodo} from "../../../api/Api";
import {useNavigate} from "react-router-dom";
import {Decrypt, Decrypt2, Encrypt, GenerateKey, GenerateRandomString16, RSAencrypt} from "../../../common/crypto";
import {clearCurrentProject, saveCurrentProjectId, saveCurrentProjectName} from "../../../store/projectSlice";
import {FolderOutlined} from "@ant-design/icons";
import {saveTodoTaskContent, saveTodoTaskTitle} from "../../../store/taskTodoSlice";
import CryptoJS from "crypto-js";

const TodoEdit = () => {
        const {t} = useTranslation();
        const [modalDelete, setModalDelete] = useState(false);
        const [saving, setSaving] = useState(false);
        const navigate = useNavigate();
        const dispatch = useDispatch();
        const [loading, setLoading] = useState(true);
        const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
        const currentProjectName = useSelector((state: any) => state.projectSlice.currentProjectName)
        const currentProjectId = useSelector((state: any) => state.projectSlice.currentProjectId)
        const doNotLoadTodoTask = useSelector((state: any) => state.commonSlice.doNotLoadTodoTask)
        const todoTaskTitle = useSelector((state: any) => state.taskTodoSlice.todoTaskTitle) || ''
        const todoTaskContent = useSelector((state: any) => state.taskTodoSlice.todoTaskContent)
        const todoTaskId = useSelector((state: any) => state.taskTodoSlice.todoTaskId) || null

        useEffect(() => {
            console.log(doNotLoadTodoTask)
            if (todoTaskId) {
                //修改
                if (doNotLoadTodoTask) {
                    setLoading(false);
                } else {
                    loadAllData();
                }
            } else {
                //新增
                setLoading(false);
            }
            return () => {
            };
        }, [todoTaskId]);

        const loadAllData = () => {
            let params = {
                taskId: todoTaskId,
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
                                        dispatch(saveTodoTaskTitle(res.data.taskTodo.taskTitle))
                                        let content = res.data.taskTodo.content;
                                        let strKey = res.data.taskTodo.userEncodeKey;
                                        if(strKey) {
                                            strKey = Decrypt2(strKey, keyAES_1);
                                            content = Decrypt(content, strKey, strKey);
                                        }
                                        dispatch(saveTodoTaskContent(content))
                                        dispatch(saveCurrentProjectId(res.data.taskTodo.projectId))
                                        dispatch(saveCurrentProjectName(res.data.taskTodo.projectName))
                                        setLoading(false);
                                    } else {
                                        message.error(t("syserr." + res.code));
                                    }
                                }
                            )
                            .catch(() => {
                                message.error(t("syserr.10001"));
                            });
                    } else {
                        message.error(t("syserr." + res1.code));
                    }
                }
            ).catch(() => {
                message.error(t("syserr.10001"));
            })
        };

        const saveTodo = () => {
            let params = {
                title: todoTaskTitle,
                content: todoTaskContent,
                taskId: todoTaskId,
                encryptKey: "",
                keyToken: "",
                projectId: currentProjectId
            };
            setSaving(true);
            /**
             * 加密保存
             */
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
                    } else {
                        message.error(t("syserr." + res1.code));
                    }
                }).catch(() => {
                message.error(t("syserr.10001"));
            })
        };

        const deleteTodo = () => {
            setTimeout(() => {
            }, 100);
        };

        return (
            <div>
                <Breadcrumb style={{margin: "20px 0"}} items={[
                    {
                        title: t('task.myTodoList'),
                        href: "/main/TodoPage"
                    },
                    {
                        title: t("task.todoEdit")
                    }
                ]}/>

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
                                    onChange={(e: any) => dispatch(saveTodoTaskTitle(e.target.value))}
                                    value={todoTaskTitle}
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
                                    value={todoTaskContent}
                                    onChange={(e) => {
                                        dispatch(saveTodoTaskContent(e.target.value))
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
                    open={modalDelete}
                    onCancel={() => setModalDelete(false)}
                    maskClosable={false}
                    closable={false}
                    onOk={() => deleteTodo()}
                ></Modal>
            </div>
        );
    }
;

export default TodoEdit;
