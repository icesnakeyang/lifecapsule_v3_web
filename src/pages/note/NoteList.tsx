import {
  Breadcrumb,
  Button,
  Card,
  Divider,
  List,
  message,
  Pagination,
  Select,
  Spin,
} from "antd";
import { useState, useEffect } from "react";
import { apiListMyCategory, apiListMyNote } from "../../api/Api";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  saveNoteCategoryCurrent,
  saveNoteCategoryList,
} from "../../store/noteDataSlice";
import Item from "antd/lib/list/Item";
import { EditOutlined } from "@ant-design/icons";

const { Option } = Select;

const NoteList = () => {
  const [thePageIndex, setThePageIndex] = useState(1);
  const [thePageSize, setThePageSize] = useState(10);
  const [noteList, setNoteList] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const categoryList = useSelector(
    (state: any) => state.noteDataSlice.categoryList
  );
  const currentCategoryId =
    useSelector((state: any) => state.noteDataSlice.currentCategoryId) || "";
  const [loading, setLoading] = useState(false);
  const [totalNote, setTotalNote] = useState(0);

  useEffect(() => {
    loadAllData();
    return () => {};
  }, [currentCategoryId]);

  useEffect(() => {
    loadAllData();
    return () => {};
  }, [thePageIndex]);

  const loadAllData = () => {
    let params = {
      pageIndex: thePageIndex,
      pageSize: thePageSize,
      categoryId: currentCategoryId,
    };
    setLoading(true);
    apiListMyNote(params)
      .then((res: any) => {
        if (res.code === 0) {
          setNoteList(res.data.noteList);
          setTotalNote(res.data.totalNote);
          setLoading(false);
        } else {
          message.error(t("syserr." + res.code));
          if (res.code === 10003) {
            navigate("/guest/login");
          }
        }
      })
      .catch((err) => {
        message.error(t("syserr.10001"));
        setLoading(false);
      });

    // apiListMyCategory({}).then((res: any) => {
    //   if (res.code === 0) {
    //     dispatch(saveNoteCategoryList(res.data.categoryList));
    //     // if (!currentCategoryId) {
    //     //   res.data.categoryList.map((item: any, index: number) => {
    //     //     if (item.categoryName === "DEFAULT") {
    //     //       dispatch(saveNoteCategoryCurrent(item.categoryId));
    //     //     }
    //     //   });
    //     // }
    //   }
    // });
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
              navigate("/main/noteEdit", { state: { noteId: item.noteId } });
            }}
          >
            {t("common.btDetail")}
          </Button>,
        ]}
      >
        <List.Item.Meta
          title={item.title ? item.title : "no title"}
          description={moment(item.createTime).format("LLL")}
        />
      </List.Item>
    );
  };

  return (
    <div style={{}}>
      <Breadcrumb style={{ margin: "20px 0" }}>
        <Breadcrumb.Item>
          <a href="/main/dashboard">{t("common.home")}</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{t("note.noteList")}</Breadcrumb.Item>
      </Breadcrumb>
      {loading ? (
        <div
          style={{
            marginTop: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin></Spin>
        </div>
      ) : (
        <div>
          <Card style={{}}>
            <Button
              type="primary"
              onClick={() => {
                navigate("/main/noteNew");
              }}
            >
              {t("note.btNewNote")}
            </Button>
          </Card>

          <div style={{ marginTop: 10 }}>
            <Select
              defaultValue={currentCategoryId}
              style={{ width: "400px" }}
              onSelect={(e: any) => {
                dispatch(saveNoteCategoryCurrent(e));
              }}
            >
              {categoryList.map((item: any, index: number) => {
                return (
                  <Select.Option value={item.categoryId} key={item.ids}>
                    {item.categoryName}
                  </Select.Option>
                );
              })}
            </Select>
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => {
                navigate("/main/NoteCategoryEdit");
              }}
            ></Button>

            <div style={{ marginTop: 10 }}>
              <List
                size="small"
                itemLayout="horizontal"
                bordered={true}
                dataSource={noteList || []}
                renderItem={(item) => _renderNote(item)}
              />
              <Pagination
                style={{ marginTop: 10 }}
                total={totalNote}
                current={thePageIndex}
                showQuickJumper
                showTotal={(total) => `${t("note.totalNotes")}: ${total}`}
                onChange={(page, pz) => {
                  setThePageIndex(page);
                  setThePageSize(pz);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteList;
