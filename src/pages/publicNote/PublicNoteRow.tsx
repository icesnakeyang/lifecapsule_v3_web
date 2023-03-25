import {useSelector} from "react-redux";
import {Button, Card, Col, Row} from "antd";
import moment from "moment";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

const PublicNoteRow = (data: any) => {
    const {item} = data
    console.log(item.title)
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const {t} = useTranslation()
    const navigate = useNavigate()
    return (
        <Card style={{background: themeColor.blockDark, width: '100%'}}>
            <Row style={{display: 'flex', alignItems: 'center'}}>
                <Col>
                    <div style={{color: themeColor.textLight}}>{item.title}</div>
                </Col>
                <Col offset={1} style={{color: themeColor.textLight}}>
                    {moment(item.createTime).format('ll')}
                </Col>
                <Col offset={1} style={{color: themeColor.textLight}}>
                    {item.content.length > 100 ?
                        item.content.substring(0, 100) + '...' :
                        item.content
                    }
                </Col>
                <Col offset={1}>
                    <Button type='primary' onClick={() => {
                        console.log(item.noteId)
                        navigate("/main/PublicNoteEdit", {state: {noteId: item.noteId}})
                    }}>{t('common.btDetail')}</Button>
                </Col>
            </Row>
        </Card>
    )
}
export default PublicNoteRow
