import {useParams} from "react-router-dom";
import {apiGetNoteFromMail} from "../../api/Api";
import {useEffect, useState} from "react";
import {Spin} from "antd/es";
import {Decrypt} from "../../common/crypto";
import moment from "moment";
import {Card, Col, Divider, Row} from "antd";

const PublicNoteByMail = (data: any) => {
    const {logId} = useParams()
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [fromName, setFromName] = useState('')
    const [toName, setToName] = useState('')
    const [createTime, setCreateTime] = useState<Date>()

    useEffect(() => {
        loadAllData()
    }, [])

    const loadAllData = () => {
        let params = {
            triggerId: logId
        }
        apiGetNoteFromMail(params).then((res: any) => {
            if (res.code === 0) {
                let c1 = Decrypt(res.data.note.content, res.data.note.userEncodeKey, res.data.note.userEncodeKey);
                setContent(c1);
                setTitle(res.data.note.title)
                setFromName(res.data.note.fromName)
                setToName(res.data.note.toName)
                setCreateTime(res.data.note.createTime)
                setLoading(false)
            }
        })
    }
    return (
        <div>
            <div style={{
                padding: 20,
                display: "flex",
                justifyContent: 'center',
                alignItems: 'center',
                minHeight:'100vh',
                flexDirection:'column'
            }}>
                {loading ?
                    <Spin size='large'/> :
                    <Card title={title} style={{background: '#eee', padding: 20, maxWidth: 1080, border: '2px solid'}}>
                        <Row>
                            <Col span={3} style={{textAlign: 'right'}}>From</Col>
                            <Col span={20} offset={1}>{fromName}</Col>
                        </Row>
                        <Row>
                            <Col span={3} style={{textAlign: 'right'}}>Create time</Col>
                            <Col span={20} offset={1}>{moment(createTime).format('LLL')}</Col>
                        </Row>
                        <Row>
                            <Col span={3} style={{textAlign: 'right'}}>To</Col>
                            <Col span={20} offset={1}>{toName}</Col>
                        </Row>
                        <Divider/>
                        <div style={{fontSize: 18, lineHeight: 2}}>{content}</div>
                    </Card>
                }
                <div style={{marginTop:50, fontSize:24, fontWeight:'bold'}}>
                    Welcome LifeCapsule
                </div>
                <div style={{marginTop:10}}>
                    <a href='/'>tellmeafter.com</a>
                </div>
                <div style={{marginTop:10, fontSize:14, color:'#f17c37'}}>
                    Write notes and share to others
                </div>
            </div>

        </div>
    )
}
export default PublicNoteByMail
