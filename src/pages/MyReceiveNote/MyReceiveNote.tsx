import { apiListMyNoteReceiveLog } from "../../api/Api";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  saveReceiveNoteList,
  saveReceivePageIndex,
  saveReceivePageSize,
  saveTotalReceiveNote,
  saveTotalReceiveNoteUnread,
} from "../../store/noteSendSlice";
import MyReceiveNoteRow from "./MyReceiveNoteRow";
import { Breadcrumb, Pagination, Spin } from "antd";
import { useTranslation } from "react-i18next";

const MyReceiveNote = () => {
  const receiveNoteList = useSelector(
    (state: any) => state.noteSendSlice.receiveNoteList
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
  const totalReceiveNote = useSelector(
    (state: any) => state.noteSendSlice.totalReceiveNote
  );
  const totalReceiveNoteUnread = useSelector(
    (state: any) => state.noteSendSlice.totalReceiveNoteUnread
  );
  const receivePageIndex = useSelector(
    (state: any) => state.noteSendSlice.receivePageIndex || 1
  );
  const receivePageSize = useSelector(
    (state: any) => state.noteSendSlice.receivePageSize || 10
  );

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    loadAllData();
  }, [receivePageIndex, receivePageSize]);

  const loadAllData = () => {
    let params = {
      pageIndex: receivePageIndex,
      pageSize: receivePageSize,
    };
    apiListMyNoteReceiveLog(params).then((res: any) => {
      if (res.code === 0) {
        dispatch(saveReceiveNoteList(res.data.receiveNoteList));
        dispatch(saveTotalReceiveNote(res.data.totalReceiveNote));
        dispatch(saveTotalReceiveNoteUnread(res.data.totalReceiveNoteUnread));
        setLoading(false);
      }
    });
  };

  return (
    <div>
      <Breadcrumb style={{ padding: 10 }}>
        <Breadcrumb.Item>
          <a href="/main/dashboard">
            <span style={{ color: themeColor.textLight }}>
              {t("common.home")}
            </span>
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span style={{ color: themeColor.textLight }}>
            {t("nav.myReceiveNote")}
          </span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <Spin style={{ marginTop: 200 }} />
        ) : (
          <div style={{ width: "100%" }}>
            {receiveNoteList.length > 0 ? (
              <>
                <div style={{ marginTop: 20 }}>
                  {receiveNoteList.map((item: any, index: any) => (
                    <MyReceiveNoteRow item={item} key={index} />
                  ))}
                </div>
                <Pagination
                  style={{ marginTop: 10, color: themeColor.textLight }}
                  total={totalReceiveNote}
                  current={receivePageIndex}
                  //   showQuickJumper
                  showTotal={(total) => `${t("MyNotes.totalNotes")}: ${total}`}
                  onChange={(page, pz) => {
                    dispatch(saveReceivePageIndex(page));
                    dispatch(saveReceivePageSize(pz));
                  }}
                />
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 200,
                  color: themeColor.textLight,
                  fontSize: 20,
                }}
              >
                {t("common.noData")}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default MyReceiveNote;
