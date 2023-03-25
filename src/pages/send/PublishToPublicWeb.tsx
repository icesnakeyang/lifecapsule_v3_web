import {useDispatch, useSelector} from "react-redux";
import {Button, Card, Form, Input, message} from "antd";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {saveSendNoteContent, saveSendNoteTitle} from "../../store/noteSendSlice";
import {apiPublishNoteToPublicWeb} from "../../api/Api";
import {useNavigate} from "react-router-dom";

const PublishToPublicWeb = () => {
    const sendNoteTitle = useSelector((state: any) => state.noteSendSlice.sendNoteTitle)
    const sendNoteContent = useSelector((state: any) => state.noteSendSlice.sendNoteContent)
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const {t} = useTranslation()
    const dispatch = useDispatch()
    const [saving, setSaving] = useState(false)
    const navigate = useNavigate()

    const onPublish = () => {
        let params = {
            title: sendNoteTitle,
            content: sendNoteContent
        }
        console.log(params)
        setSaving(true)
        apiPublishNoteToPublicWeb(params).then((res: any) => {
            if (res.code === 0) {
                message.success(t('note.send.publishToPublicPage.tipPublishSuccess'))
                navigate(-1)
            } else {
                message.error(t('syserr.' + res.code))
                setSaving(false)
            }
        }).catch(() => {
            message.error(t('syserr.10001'))
            setSaving(false)
        })
    }

    return (
        <Card title={t('note.send.publishToPublicPage.title')} style={{background: themeColor.blockDark}}
              headStyle={{color: themeColor.textLight}}>
            <div>
                <Form>
                    <Form.Item>
                        <Input style={{
                            background: themeColor.blockDark,
                            color: themeColor.textLight,
                        }} value={sendNoteTitle}
                               onChange={(e) => {
                                   dispatch(saveSendNoteTitle(e.target.value))
                               }}/>
                    </Form.Item>
                    <Form.Item>
                        <Input.TextArea autoSize={true} style={{
                            color: themeColor.textLight,
                            backgroundColor: themeColor.blockDark,
                        }} value={sendNoteContent}
                                        onChange={(e) => {
                                            dispatch(saveSendNoteContent(e.target.value))
                                        }}
                        />
                    </Form.Item>
                </Form>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    {saving ?
                        <Button type='primary' loading>{t('note.send.publishToPublicPage.btPublishing')}</Button>
                        :
                        <Button type='primary' onClick={() => {
                            onPublish()
                        }}>{t('note.send.publishToPublicPage.btPublish')}</Button>
                    }
                </div>
            </div>

        </Card>
    )
}
export default PublishToPublicWeb
