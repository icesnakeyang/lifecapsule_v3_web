import {Button, Card, Checkbox, Col, message, Modal, Row, Spin} from "antd";
import {apiDeleteMyTaskTodo, apiUpdateMyTaskTodoCompleteStatus} from "../../../api/Api";
import {useTranslation} from "react-i18next";
import {CheckboxChangeEvent} from "antd/lib/checkbox";
import {useDispatch, useSelector} from "react-redux";
import {loadRefresh, saveDoNotLoadToDoTask} from "../../../store/commonSlice";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import {saveTodoTaskId} from "../../../store/taskTodoSlice";

const TodoRow = (data: any) => {
    const {item} = data;
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modalDelete, setModalDelete] = useState(false);
    const [saving, setSaving] = useState(false);
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
    const [complete, setComplete] = useState(false)

    useEffect(() => {
        setComplete(item.complete)
    }, [])

    const onUpdateCompleteStatus = (e: CheckboxChangeEvent, taskId: string) => {
        let params = {
            taskId,
            complete: e.target.checked,
        };
        apiUpdateMyTaskTodoCompleteStatus(params)
            .then((res: any) => {
                if (res.code === 0) {
                    dispatch(loadRefresh());
                } else {
                    message.error(t("syserr." + res.code));
                }
            })
            .catch(() => {
                message.error(t("syserr.10001"));
            });
    };

    const onDeleteTask = () => {
        let params = {
            taskId: item.taskId,
        };
        setSaving(true);
        apiDeleteMyTaskTodo(params)
            .then((res: any) => {
                if (res.code === 0) {
                    message.success(t("task.tipDeleteSuccess"));
                    dispatch(loadRefresh());
                    setSaving(false)
                } else {
                    message.success(t("syserr." + res.code));
                    setSaving(false);
                    setModalDelete(false);
                }
            })
            .catch(() => {
                message.success(t("syserr.10001"));
                setSaving(false);
                setModalDelete(false);
            });
    };

    return (
        <div style={{marginTop:5}}>
            <Card size='small' style={{background:themeColor.blockDark}}>
                <div style={{display: 'flex'}}>
                    <div style={{width: 30}}>
                        <Checkbox
                            checked={complete}
                            onChange={(e) => {
                                onUpdateCompleteStatus(e, item.taskId);
                                setComplete(e.target.checked)
                            }}
                        ></Checkbox>
                    </div>
                    <div style={{width: '100%'}}>
                        {complete ? (
                            <div
                                style={{
                                    textDecorationLine: "line-through",
                                    textDecorationStyle: "double",
                                    color: themeColor.textHolder,
                                    overflow: 'hidden',
                                    wordBreak: "break-all",
                                }}
                            >
                                {item.taskTitle}
                            </div>
                        ) : (
                            <div style={{
                                color: themeColor.textLight,
                                overflow: 'hidden',
                                wordBreak: "break-all",
                                marginLeft: 10
                            }}>{item.taskTitle}</div>
                        )}
                    </div>
                    <div style={{width: 150}}>
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                                dispatch(saveTodoTaskId(item.taskId))
                                dispatch(saveDoNotLoadToDoTask(false))
                                navigate("/main/TodoEdit");
                            }}
                        >
                            {t("common.btDetail")}
                        </Button>

                        <Button
                            style={{marginLeft:10}}
                            type="primary"
                            size="small"
                            danger
                            onClick={() => setModalDelete(true)}
                        >
                            {t("common.btDelete")}
                        </Button>
                    </div>
                </div>
            </Card>


            <Modal
                open={modalDelete}
                onCancel={() => setModalDelete(false)}
                title={t("task.tipDelete1")}
                onOk={() => onDeleteTask()}
                closable={false}
                maskClosable={false}
            >
                {saving ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Spin tip={t("common.btDeleting")}/>
                    </div>
                ) : (
                    <div style={{display: "flex", alignItems: "center"}}>
                        <ExclamationCircleOutlined style={{fontSize: 20, color: "red"}}/>
                        <div style={{marginLeft: 10}}>{t("task.tipDelete2")}</div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default TodoRow;
