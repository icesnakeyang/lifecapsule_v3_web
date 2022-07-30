import { useEffect, useState } from "react";
import { apiListMyQuadTask } from "../../../api/Api";
import { useTranslation } from "react-i18next";
import { Breadcrumb, Button, Card, message, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  saveTaskQuadList,
  saveTotalTaskQuad,
} from "../../../store/taskQuadSlic";
import QuadrantTaskRow from "./QuadrantTaskRow";
import { clearRefresh, clearRichContent } from "../../../store/commonSlice";

const QuadrantTaskList = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
  const dispatch = useDispatch();
  const taskQuadList = useSelector(
    (state: any) => state.taskQuadSlice.taskQuadList
  );
  const totalTaskQuad = useSelector(
    (state: any) => state.taskQuadSlice.totalTaskQuad
  );
  const refresh = useSelector((state: any) => state.commonSlice.refresh);

  useEffect(() => {
    loadAllData();
    return () => {
      dispatch(clearRefresh());
    };
  }, []);

  useEffect(() => {
    loadAllData();
  }, [pageIndex]);

  useEffect(() => {
    loadAllData();
  }, [refresh]);

  const loadAllData = () => {
    let params = {
      pageIndex,
      pageSize,
    };
    apiListMyQuadTask(params)
      .then((res: any) => {
        if (res.code === 0) {
          dispatch(saveTaskQuadList(res.data.taskList));
          dispatch(saveTotalTaskQuad(res.data.totalTask));
        } else {
          message.error(t("syserr." + res.code));
        }
      })
      .catch(() => {
        message.error(t("syserr.10001"));
      });
  };

  const onChangePage = (page: number) => {
    setPageIndex(page);
  };

  return (
    <div>
      <Breadcrumb style={{}}>
        <Breadcrumb.Item>
          <a href="/main/dashboard">
            <span style={{ color: themeColor.textLight }}>{t("nav.home")}</span>
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span style={{ color: themeColor.textLight }}>
            {t("nav.myQuadTask")}
          </span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <p style={{ marginTop: 20 }}></p>
      <Card
        style={{
          background: themeColor.blockDark,
        }}
      >
        <Button
          type="primary"
          onClick={() => {
            dispatch(clearRichContent());
            navigate("/main/QuadrantTaskNew");
          }}
        >
          {t("task.btAddQuad")}
        </Button>
      </Card>

      <div>
        {taskQuadList &&
          taskQuadList.map((item: any, index: number) => (
            <QuadrantTaskRow item={item} key={index} />
          ))}
      </div>
      <Pagination
        style={{ color: themeColor.textLight, marginTop: 10 }}
        showQuickJumper
        defaultCurrent={pageIndex}
        total={totalTaskQuad}
        onChange={onChangePage}
      />
    </div>
  );
};

export default QuadrantTaskList;
