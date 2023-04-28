import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {apiGetMyPublicNote, apiUpdateMyPublicNote} from "../../api/Api";
import {Button, Form, Input, message} from "antd";
import {useTranslation} from "react-i18next";

const PublicNoteEdit = () => {
    const {noteId}: any = useLocation().state;
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [createTime, setCreateTime] = useState(null)
    const {t} = useTranslation()
    const [url, setUrl] = useState('')
    const [saving, setSaving] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        loadAllData()
    }, [])

    const loadAllData = () => {
        let params = {
            noteId
        }
        apiGetMyPublicNote(params).then((res: any) => {
            if (res.code === 0) {
                setTitle(res.data.note.title)
                setContent(res.data.note.content)
                setCreateTime(res.data.note.createTime)
                console.log(res.data.note.noteId)
                setUrl('https://tellmeafter.com/PublicArticle/' + res.data.note.noteId)
                // setUrl('http://localhost:3000/PublicArticle/' + res.data.note.noteId)
            } else {
                message.error(t('syserr.' + res.code))
            }
        }).catch(() => {
            message.error(t('syserr.10001'))
        })
    }

    const onSave = () => {
        let params = {
            title,
            content,
            noteId
        }
        setSaving(true)
        apiUpdateMyPublicNote(params).then((res: any) => {
            if (res.code === 0) {
                message.success(t("MyPublicNote.tipSuccess"))
                navigate(-1)
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
                <Form.Item label={t('MyPublicNote.webAddress')}>
                    <div style={{display: 'flex'}}>
                        <Input value={url} readOnly/>
                        <Button onClick={() => {
                            navigator.clipboard.writeText(url)
                        }}>{t('MyPublicNote.btCopy')}</Button>
                    </div>
                </Form.Item>
                <Form.Item>
                    <div>{t('MyPublicNote.title')}</div>
                    <Input value={title} onChange={e => setTitle(e.target.value)}/>
                </Form.Item>
                <Form.Item>
                    <div>{t('MyPublicNote.content')}</div>
                    <Input.TextArea autoSize={{minRows: 2}} value={content} onChange={e => setContent(e.target.value)}/>
                </Form.Item>
            </Form>
            <div style={{display: 'flex', justifyContent: "center"}}>
                {saving ?
                    <Button type='primary' loading>{t('common.btSaving')}</Button>
                    :
                    <Button type='primary' onClick={() => {
                        onSave()
                    }
                    }>{t('common.btSave')}</Button>
                }
            </div>
        </div>
    )
}
export default PublicNoteEdit
