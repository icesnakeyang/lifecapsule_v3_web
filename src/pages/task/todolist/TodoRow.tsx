import { Button, Checkbox, Col, message, Modal, Row, Spin } from "antd";
import { apiDeleteMyTaskTodo, apiSaveMyTaskTodo } from "../../../api/Api";
import { useTranslation } from "react-i18next";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { saveLoadData } from "../../../store/commonSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const TodoRow = (data: any) => {
  const { item } = data;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalDelete, setModalDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);

  const onComplete = (e: CheckboxChangeEvent, taskId: string) => {
    let params = {
      taskId,
      complete: e.target.checked,
    };
    apiSaveMyTaskTodo(params)
      .then((res: any) => {
        if (res.code === 0) {
          dispatch(saveLoadData(true));
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
          dispatch(saveLoadData(true));
          navigate("/main/TodoPage");
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
    <>
      <Row
        style={{
          padding: 10,
          marginTop: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // border: "1px solid #ccc",
          background: themeColor.blockDark,
        }}
      >
        <Col span="2">
          <Checkbox
            checked={item.complete}
            onChange={(e) => {
              onComplete(e, item.taskId);
            }}
          ></Checkbox>
        </Col>
        <Col
          span="14"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {item.complete ? (
            <div
              style={{
                textDecorationLine: "line-through",
                textDecorationStyle: "double",
                color: themeColor.textLight,
              }}
            >
              {item.title}
            </div>
          ) : (
            <div style={{ color: themeColor.textLight }}>{item.title}</div>
          )}
        </Col>
        <Col span="4">
          <Button
            type="primary"
            size="small"
            onClick={() => {
              navigate("/main/TodoEdit", { state: { taskId: item.taskId } });
            }}
          >
            {t("common.btDetail")}
          </Button>
        </Col>
        <Col span="4">
          <Button
            type="primary"
            size="small"
            danger
            onClick={() => setModalDelete(true)}
          >
            {t("common.btDelete")}
          </Button>
        </Col>
      </Row>

      <Modal
        visible={modalDelete}
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
            <Spin tip={t("common.btDeleting")} />
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center" }}>
            <ExclamationCircleOutlined style={{ fontSize: 20, color: "red" }} />
            <div style={{ marginLeft: 10 }}>{t("task.tipDelete2")}</div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default TodoRow;
