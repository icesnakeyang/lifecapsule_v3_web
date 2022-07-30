import { Button, Card, Col, message, Row, Tag } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { loadRefresh, saveLoadData } from "../../../store/commonSlice";
import {
  apiDecreaseQuadTaskPriority,
  apiIncreaseQuadTaskPriority,
} from "../../../api/Api";
const QuadrantTaskRow = (data: any) => {
  const { item } = data;
  const { t } = useTranslation();
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onTaskPriorityUp = () => {
    let params = { taskId: item.taskId };
    apiIncreaseQuadTaskPriority(params)
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

  const onTaskPriorityDown = () => {
    let params = { taskId: item.taskId };
    apiDecreaseQuadTaskPriority(params)
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

  return (
    <div style={{ marginTop: 20 }}>
      <Card style={{ background: themeColor.blockDark }}>
        <Row>
          <Col>
            <div style={{ color: themeColor.textLight }}> {item.taskTitle}</div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div style={{ color: themeColor.textLight }}>
              {" "}
              {t("task.createTime")}: {moment(item.createTime).format("LLL")}
            </div>
          </Col>
          <Col offset="1">
            {item.important === "IMPORTANT_AND_URGENT" ? (
              <span>
                <Tag color="#cf1322">{t("task.IMPORTANT_AND_URGENT")}</Tag>
              </span>
            ) : null}
            {item.important === "IMPORTANT_NOT_URGENT" ? (
              <span>
                <Tag color="#096dd9">{t("task.IMPORTANT_NOT_URGENT")}</Tag>
              </span>
            ) : null}
            {item.important === "URGENT_NOT_IMPORTANT" ? (
              <span>
                <Tag color="#d4b106">{t("task.URGENT_NOT_IMPORTANT")}</Tag>
              </span>
            ) : null}
            {item.important === "NOTHING" ? (
              <span>
                <Tag color="#8c8c8c">{t("task.NOTHING")}</Tag>
              </span>
            ) : null}
          </Col>
          <Col offset="1">
            {item.status === "PROGRESS" ? (
              <span>
                <Tag color="blue">{t("common.PROGRESS")}</Tag>
              </span>
            ) : null}
            {item.status === "COMPLETE" ? (
              <span>
                <Tag color="success">{t("common.COMPLETE")}</Tag>
              </span>
            ) : null}
          </Col>
          <Col offset="1">
            <Button
              type="primary"
              size="small"
              onClick={() => {
                navigate("/main/QuadrantTaskEdit", {
                  state: { taskId: item.taskId },
                });
              }}
            >
              {t("common.btDetail")}
            </Button>
          </Col>
          <Col offset="1">
            <span style={{ color: themeColor.textLight }}>
              {" "}
              {t("task.priority")}:{item.priority}
            </span>

            <Button
              style={{ marginLeft: 10 }}
              shape="circle"
              icon={<ArrowUpOutlined />}
              size="small"
              onClick={onTaskPriorityUp}
            ></Button>
            <Button
              style={{ marginLeft: 10 }}
              shape="circle"
              icon={<ArrowDownOutlined />}
              size="small"
              onClick={onTaskPriorityDown}
            ></Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default QuadrantTaskRow;
