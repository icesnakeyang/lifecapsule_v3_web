import {useSelector} from "react-redux";
import {Button, Card, Col, Row} from "antd";
import moment from "moment";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

const PublicNoteRow = (data: any) => {
    const {item} = data
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const {t} = useTranslation()
    const navigate = useNavigate()
    return (
        <Card size='small' style={{marginTop: 10, background: themeColor.blockDark, width: '100%'}}>
            <div style={{color: themeColor.textLight, fontSize: 20}}>
                <a onClick={() => {
                    navigate("/main/PublicNoteEdit", {state: {noteId: item.noteId}})
                }} style={{color: themeColor.textLight}}>{item.title}</a>
            </div>

            <div style={{marginTop:10, color:themeColor.textHolder}}>
                {item.content.length > 300 ?
                    item.content.substring(0, 300) + '...' :
                    item.content
                }
            </div>

            <div style={{marginTop:5, color:themeColor.textHolder}}>
                {moment(item.createTime).format('ll')}
            </div>



        </Card>
    )
}
export default PublicNoteRow
