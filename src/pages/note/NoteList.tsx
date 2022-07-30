import {
  Breadcrumb,
  Button,
  Card,
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
  saveNoteList,
  saveNotePageIndex,
  saveNotePageSize,
} from "../../store/noteDataSlice";
import { EditOutlined } from "@ant-design/icons";
import { clearRichContent } from "../../store/commonSlice";
import NoteListRow from "./NoteListRow";

const NoteList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const categoryList = useSelector(
    (state: any) => state.noteDataSlice.categoryList||[]
  );
  const currentCategoryId =
    useSelector((state: any) => state.noteDataSlice.currentCategoryId) || "";
  const [loading, setLoading] = useState(true);
  const [totalNote, setTotalNote] = useState(0);
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
  const notePageIndex = useSelector(
    (state: any) => state.noteDataSlice.notePageIndex
  );
  const notePageSize = useSelector(
    (state: any) => state.noteDataSlice.notePageSize
  );
  const noteList =
    useSelector((state: any) => state.noteDataSlice.noteList) || [];

  useEffect(() => {
    console.log(currentCategoryId)
    console.log(categoryList)
    if(currentCategoryId){
      console.log('有')
    }else{
      console.log('没有')
    }
    loadAllData();
    return () => {};
  }, [currentCategoryId]);

  useEffect(() => {
    loadAllData();
    return () => {};
  }, [notePageIndex]);

  const loadAllData = () => {
    /**
     * 如果当前没有categoryId，就读取默认的category
     */
    /**
     * 读取category列表
     */
    apiListMyCategory({}).then((res: any) => {
      if (res.code === 0) {
        dispatch(saveNoteCategoryList(res.data.categoryList));

        let params = {
          pageIndex: notePageIndex,
          pageSize: notePageSize,
          categoryId: currentCategoryId,
        };
        setLoading(true);
        apiListMyNote(params)
          .then((res: any) => {
            if (res.code === 0) {
              dispatch(saveNoteList(res.data.noteList));
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
      }
    });
  };

  return (
    <div style={{}}>
      <Breadcrumb style={{ margin: "20px 0" }}>
        <Breadcrumb.Item>
          <a href="/main/dashboard">
            <span style={{ color: themeColor.textLight }}>
              {t("common.home")}
            </span>
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span style={{ color: themeColor.textLight }}>
            {t("note.noteList")}
          </span>
        </Breadcrumb.Item>
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
          <Card style={{ background: themeColor.blockDark }}>
            <Button
              type="primary"
              onClick={() => {
                dispatch(clearRichContent());
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
              {noteList
                ? noteList.map((item: any, index: any) => (
                    <NoteListRow item={item} key={index} />
                  ))
                : null}
            </div>
            <Pagination
              style={{ marginTop: 10, color: themeColor.textLight }}
              total={totalNote}
              current={notePageIndex}
              showQuickJumper
              showTotal={(total) => `${t("note.totalNotes")}: ${total}`}
              onChange={(page, pz) => {
                dispatch(saveNotePageIndex(page));
                dispatch(saveNotePageSize(pz));
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteList;
