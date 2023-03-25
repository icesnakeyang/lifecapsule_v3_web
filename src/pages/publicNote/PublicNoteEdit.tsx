import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {apiGetMyPublicNote} from "../../api/Api";
import {Form, Input, message} from "antd";
import {useTranslation} from "react-i18next";

const PublicNoteEdit = () => {
    const {noteId}: any = useLocation().state;
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [createTime, setCreateTime] = useState(null)
    const {t} = useTranslation()

    useEffect(() => {
        loadAllData()
    }, [])

    const loadAllData = () => {
        let params = {
            noteId
        }
        console.log(noteId)
        apiGetMyPublicNote(params).then((res: any) => {
            if (res.code === 0) {
                setTitle(res.data.note.title)
                setContent(res.data.note.content)
                setCreateTime(res.data.note.createTime)
            } else {
                message.error(t('syserr.' + res.code))
            }
        }).catch(() => {
            message.error(t('syserr.10001'))
        })
    }
    return (
        <div>
            <Form>
                <Form.Item>
                    <Input value={title} onChange={e => setTitle(e.target.value)}/>
                </Form.Item>
                <Form.Item>
                    <Input.TextArea value={content} onChange={e => setContent(e.target.value)}/>
                </Form.Item>
            </Form>
        </div>
    )
}
export default PublicNoteEdit
