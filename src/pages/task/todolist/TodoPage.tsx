import { Breadcrumb, Button, Card, List, message, Pagination } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiListMyTaskTodo } from "../../../api/Api";
import {
  saveTodoList,
  saveTodoPageIndex,
  saveTodoPageSize,
  saveTotalTodo,
} from "../../../store/taskTodoSlice";
import { useNavigate } from "react-router-dom";
import { clearRichContent, saveLoadData } from "../../../store/commonSlice";
import TodoRow from "./TodoRow";

const TodoPage = () => {
  const [loadMore, setLoadMore] = useState(false);
  const dispatch = useDispatch();
  const todoList = useSelector((state: any) => state.taskTodoSlice.todoList);
  const totalTodo = useSelector((state: any) => state.taskTodoSlice.totalTodo);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loadData = useSelector((state: any) => state.commonSlice.loadData);
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
  const todoPageIndex = useSelector(
    (state: any) => state.taskTodoSlice.todoPageIndex || 1
  );
  const todoPageSize = useSelector(
    (state: any) => state.taskTodoSlice.todoPageSize || 10
  );

  useEffect(() => {
    loadAllData();
    return () => {};
  }, [todoPageIndex]);

  useEffect(() => {
    if (loadData) {
      loadAllData();
      dispatch(saveLoadData(false));
    }
  }, [loadData]);

  const loadAllData = () => {
    let params = {
      pageIndex: todoPageIndex,
      pageSize: todoPageSize,
    };
    apiListMyTaskTodo(params)
      .then((res: any) => {
        if (res.code === 0) {
          if (loadMore) {
            dispatch(saveTodoList(todoList.concat(res.data.taskTodoList)));
          } else {
            dispatch(saveTodoList(res.data.taskTodoList));
          }
          dispatch(saveTotalTodo(res.data.totalTaskTodo));
          setLoadMore(false);
        } else {
          message.error(t("syserr." + res.code));
        }
      })
      .catch(() => {
        message.error(t("syserr.10001"));
      });
  };

  const _renderNote = (item: any) => {
    return (
      <List.Item
        style={{ background: "#fff" }}
        actions={[
          <Button
            type="primary"
            size="small"
            onClick={() => {
              dispatch(clearRichContent());
              navigate("/main/TodoEdit", { state: { taskId: item.taskId } });
            }}
          >
            {t("common.btDetail")}
          </Button>,
        ]}
      >
        dlskdjsl{item.complete}
        {item.complete}
        {item.complete ? (
          <div style={{}}>{item.title}完成</div>
        ) : (
          <div>{item.title}未完成</div>
        )}
        {/* <List.Item.Meta title={item.title} description="" /> */}
      </List.Item>
    );
  };

  return (
    <div>
      <Breadcrumb style={{}}>
        <Breadcrumb.Item>
          <span style={{ color: themeColor.textLight }}>
            {t("task.myTodoList")}
          </span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card style={{ background: themeColor.blockDark }}>
        <Button
          type="primary"
          onClick={() => {
            dispatch(clearRichContent());
            navigate("/main/TodoEdit", { state: { taskId: null } });
          }}
        >
          {t("task.btAddTodo")}
        </Button>
      </Card>

      <div style={{ marginTop: 10 }}>
        {todoList.map((item: any, index: number) => {
          return <TodoRow item={item} key={index} />;
        })}
        <Pagination
          style={{ marginTop: 10, color: themeColor.textLight }}
          total={totalTodo}
          current={todoPageIndex}
          showQuickJumper
          showTotal={(total) => `${t("note.totalNotes")}: ${total}`}
          onChange={(page, pz) => {
            dispatch(saveTodoPageIndex(page));
            dispatch(saveTodoPageSize(pz));
          }}
        />
      </div>
    </div>
  );
};

export default TodoPage;
