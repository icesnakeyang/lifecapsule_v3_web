import {Button, Card} from "antd";
import moment from "moment";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {saveNoteId} from "../../store/noteDataSlice";

const NoteListRow = (data: any) => {
    const {item} = data;
    const navigate = useNavigate();
    const {t} = useTranslation();
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
    const dispatch = useDispatch()
    return (
        <Card
            size='small'
            bordered={false}
            style={{
                background: themeColor.blockDark,
                marginTop: 10,
                // color: themeColor.textLight,
                // padding: 0,
            }}
        >
            <div>
                <a
                    style={{color: themeColor.textLight}}
                    onClick={() => {
                        dispatch(saveNoteId(item.noteId))
                        navigate("/main/noteEdit", {state: {noteId: item.noteId}})
                    }}
                >
                    {item.title ? item.title : "no title"}
                </a>
            </div>
            <div>
                <div style={{color: themeColor.textHolder, fontSize: 10}}>
                    {moment(item.createTime).format("LLL")}
                </div>
            </div>
        </Card>
    );
};

export default NoteListRow;
