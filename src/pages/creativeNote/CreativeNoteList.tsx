import { Breadcrumb, Button, Card, message, Pagination, Spin } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiListMyCreativeNote } from "../../api/Api";
import {
  saveCreativeNoteList,
  savePageIndexCreativeNote,
  savePageSizeCreativeNote,
  saveTotalCreativeNote,
} from "../../store/creativeNoteSlice";
import CreativeNoteRow from "./CreativeNoteRow";
const CreativeNoteList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const creativeNoteList = useSelector(
    (state: any) => state.creativeNoteSlice.creativeNoteList || []
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const totalCreativeNote = useSelector(
    (state: any) => state.creativeNoteSlice.totalCreativeNote || 0
  );
  const pageIndexCreativeNote = useSelector(
    (state: any) => state.creativeNoteSlice.pageIndexCreativeNote || 1
  );
  const pageSizeCteativeNote = useSelector(
    (state: any) => state.creativeNoteSlice.pageSizeCteativeNote
  );
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);

  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    loadAllData();
  }, [pageIndexCreativeNote]);

  const loadAllData = () => {
    let params = {
      pageIndex: pageIndexCreativeNote,
      pageSize: pageSizeCteativeNote,
    };
    apiListMyCreativeNote(params)
      .then((res: any) => {
        if (res.code === 0) {
          dispatch(saveCreativeNoteList(res.data.creativeNoteList));
          dispatch(saveTotalCreativeNote(res.data.totalCreativeNote));
          setLoading(false);
        } else {
          message.error(t("syserr." + res.code));
        }
      })
      .catch(() => {
        message.error(t("syserr.10001"));
      });
  };

  return (
    <div>
      <Breadcrumb style={{ margin: "20px 0" }}>
        <Breadcrumb.Item>
          <a href="/main/dashboard">
            <span style={{ color: themeColor.textLight }}>{t("nav.home")}</span>
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span style={{ color: themeColor.textLight }}>
            {t("nav.creativeNote")}
          </span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Card style={{ background: themeColor.blockDark }}>
        <Button
          type="primary"
          onClick={() => {
            navigate("/main/CreativeNoteEdit");
          }}
        >
          {t("creativeNote.btAddNew")}
        </Button>
      </Card>
      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 100 }}
        >
          <Spin />
        </div>
      ) : (
        <>
          {creativeNoteList.map((item: any, index: number) => (
            <CreativeNoteRow data={item} key={index} />
          ))}
          <Pagination
            style={{ marginTop: 10, color: themeColor.textLight }}
            total={totalCreativeNote}
            current={pageIndexCreativeNote}
            showQuickJumper
            showTotal={(total) => `${t("note.totalNotes")}: ${total}`}
            onChange={(page, pz) => {
              dispatch(savePageIndexCreativeNote(page));
              dispatch(savePageSizeCreativeNote(pz));
            }}
          />
        </>
      )}
    </div>
  );
};

export default CreativeNoteList;
