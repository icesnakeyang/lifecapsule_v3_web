import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useSelector } from "react-redux";
const CreativeNoteRow = (data: any) => {
  const { t } = useTranslation();
  const item = data.data;
  const navigate = useNavigate();
  const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
  return (
    <div
      style={{
        marginTop: 10,
        background: themeColor.blockDark,
        padding: 10,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <a
            style={{ color: themeColor.textLight }}
            onClick={() =>
              navigate("/main/CreativeNoteEdit", {
                state: { noteId: item.noteId },
              })
            }
          >
            {item.title}
          </a>
        </div>
      </div>
      <div style={{ fontSize: "9px", color: themeColor.textHolder }}>
        {moment(item.createTime).format("LLL")}
      </div>
    </div>
  );
};

export default CreativeNoteRow;
