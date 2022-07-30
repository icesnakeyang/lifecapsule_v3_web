import { Button, Card } from "antd";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NoteListRow = (data: any) => {
  const { item } = data;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
  return (
    <div
      style={{
        background: themeColor.blockDark,
        marginTop: 10,
        color: themeColor.textLight,
        padding: 10,
      }}
    >
      <div>
        <a
          style={{ color: themeColor.textLight }}
          onClick={() =>
            navigate("/main/noteEdit", { state: { noteId: item.noteId } })
          }
        >
          {item.title ? item.title : "no title"}
        </a>
      </div>
      <div>
        <div style={{ color: themeColor.textHolder, fontSize: 10 }}>
          {moment(item.createTime).format("LLL")}
        </div>
      </div>
    </div>
  );
};

export default NoteListRow;
