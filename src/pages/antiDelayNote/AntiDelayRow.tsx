import {Card, Col, Row} from "antd";
import {useSelector} from "react-redux";
import moment from "moment";
import {useNavigate} from "react-router-dom";

const AntiDelayRow = (data: any) => {
    const {item} = data
    const navigate = useNavigate()
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    return (
        <Card style={{margin: '10px 0 0 0', background: themeColor.blockDark}}>
            <Row>
                <Col>
                    <a style={{color: themeColor.textLight, fontSize: 18, fontWeight: 'bold'}}
                       onClick={() => {
                           navigate("/main/AntiDelayNoteEdit", {state: {antiDelayNoteId: item.noteId}})
                       }}
                    >{item.title}</a>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div style={{color: themeColor.textLight}}>
                        {moment(item.createTime).format('ll')}
                    </div>
                </Col>
            </Row>

        </Card>
    )
}
export default AntiDelayRow
