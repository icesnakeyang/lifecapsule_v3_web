import {useParams} from "react-router-dom";
import {apiGetNoteFromMail} from "../../api/Api";
import {useEffect, useState} from "react";
import {Spin} from "antd/es";
import {Decrypt} from "../../common/crypto";
import moment from "moment";
import {Card, Col, Divider, message, Row} from "antd";
import {useTranslation} from "react-i18next";
import TextArea from "antd/es/input/TextArea";

const PublicNoteByMail = (data: any) => {
    const {logId} = useParams()
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [fromName, setFromName] = useState('')
    const [toName, setToName] = useState('')
    const [createTime, setCreateTime] = useState<Date>()
    const {t} = useTranslation()
    const [overdue, setOverdue] = useState(false)

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
            } else {
                if (res.code === 10080) {
                    setOverdue(true)
                    setLoading(false)
                } else {
                }
            }
        }).catch(() => {
            message.error(t('syserr.10001'))
        })
    }
    return (
        <div>
            <div style={{
                padding: 20,
                display: "flex",
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                flexDirection: 'column'
            }}>
                {loading ?
                    <Spin size='large'/> :
                    <Card title={title} style={{
                        background: '#eee',
                        padding: 20, maxWidth: 1080,
                        border: '2px solid',
                        width: '100%',
                        color: '#333'
                    }}
                          headStyle={{color: '#333'}}
                    >
                        {overdue ?
                            <div>{t('public.mail.tipOverdue')}<a href="/">LifeCapsule</a></div>
                            :
                            <div style={{width: '100%'}}>
                                <Row style={{width: '100%'}}>
                                    <Col span={3} style={{textAlign: 'right'}}>From</Col>
                                    <Col span={20} offset={1}>{fromName}</Col>
                                </Row>
                                <Row style={{marginTop: 10}}>
                                    <Col span={3} style={{textAlign: 'right'}}>Create time</Col>
                                    <Col span={20} offset={1}>{moment(createTime).format('LLL')}</Col>
                                </Row>
                                <Row style={{marginTop: 10}}>
                                    <Col span={3} style={{textAlign: 'right'}}>To</Col>
                                    <Col span={20} offset={1}>{toName}</Col>
                                </Row>
                                <div style={{marginTop: 20}}>
                                    <TextArea autoSize style={{
                                        borderWidth: 0.1,
                                        fontSize: 18,
                                        lineHeight: 2,
                                        background: '#eee',
                                        color: '#333'
                                    }} value={content}/>
                                </div>
                            </div>
                        }
                    </Card>
                }
                <div style={{marginTop: 50, fontSize: 24, fontWeight: 'bold'}}>
                    Welcome LifeCapsule
                </div>
                <div style={{marginTop: 10}}>
                    <a href='/'>tellmeafter.com</a>
                </div>
                <div style={{marginTop: 10, fontSize: 14, color: '#f17c37'}}>
                    Write notes and share to others
                </div>
            </div>

        </div>
    )
}
export default PublicNoteByMail
