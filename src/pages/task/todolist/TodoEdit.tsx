import { Breadcrumb, Button, Form, Input, message, Modal, Spin } from "antd";
import FormItem from "antd/lib/form/FormItem";
import MyEditor from "../../components/MyEditor/MyEditor";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiGetMyTaskTodo, apiSaveMyTaskTodo } from "../../../api/Api";
import { useNavigate, useLocation } from "react-router-dom";
import { saveRichContent } from "../../../store/commonSlice";

const TodoEdit = () => {
  const { taskId }: any = useLocation().state;
  const { t } = useTranslation();
  const [todoTitle, setTodoTitle] = useState("");
  const [todoContent, setTodoContent] = useState("");
  const richContent = useSelector(
    (state: any) => state.commonSlice.richContent
  );
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
    return () => {};
  }, [taskId]);

  const loadAllData = () => {
    let params = {
      taskId,
    };
    apiGetMyTaskTodo(params)
      .then((res: any) => {
        if (res.code === 0) {
          setTodoTitle(res.data.taskTodo.title);
          setTodoContent(res.data.taskTodo.content);
          dispatch(saveRichContent(res.data.taskTodo.content));
          setLoading(false);
        } else {
          message.error(t("syserr." + res.code));
        }
      })
      .catch(() => {
        message.error(t("syserr.10001"));
      });
  };

  const saveTodo = () => {
    let params = {
      title: todoTitle,
      content: richContent,
      taskId,
    };

    setSaving(true);
    apiSaveMyTaskTodo(params)
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
    setTimeout(() => {}, 100);
  };

  return (
    <div>
      <Breadcrumb style={{ margin: "20px 0" }}>
        <Breadcrumb.Item>
          <a href="/main/TodoPage">
            <span style={{ color: themeColor.textLight }}>
              {t("task.myTodoList")}
            </span>
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span style={{ color: themeColor.textLight }}>
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
          <Spin />
        </div>
      ) : (
        <>
          <Form layout="vertical">
            <FormItem>
              <div style={{ color: themeColor.textLight }}>
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
              <div style={{ color: themeColor.textLight }}>
                {t("task.content")}
              </div>
              <div
                style={{
                  border: "1px solid #ccc",
                  padding: 5,
                  background: themeColor.blockDark,
                  color: themeColor.textLight,
                }}
              >
                <MyEditor type="NORMAL" />
              </div>
            </FormItem>
          </Form>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {saving ? (
              <Button style={{ width: "140px" }} block type="primary" loading>
                {t("task.btSaving")}
              </Button>
            ) : (
              <Button
                style={{ width: "140px" }}
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
