import {Breadcrumb, Button, Form, Input, message} from "antd";
import {useTranslation} from "react-i18next";
import {SmileTwoTone} from "@ant-design/icons";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {apiWebPublishNoteToTopic} from "../../../api/Api";
import {useNavigate} from "react-router-dom";

const PublishToTopic = () => {
    const {t} = useTranslation()
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const [title, setTitle] = useState('')
    const sendNoteTitle = useSelector((state: any) => state.noteSendSlice.sendNoteTitle)
    const [authorName, setAuthorName] = useState('')
    const nickname = useSelector((state: any) => state.userDataSlice.nickname)
    const [content, setContent] = useState('')
    const sendNoteContent = useSelector((state: any) => state.noteSendSlice.sendNoteContent)
    const [saving, setSaving] = useState(false)
    const noteId = useSelector((state: any) => state.noteDataSlice.noteId)
    const navigate = useNavigate()

    useEffect(() => {
        console.log(sendNoteTitle)
        setTitle(sendNoteTitle)
        setAuthorName(nickname)
        setContent(sendNoteContent)
    }, [])

    const onSend = () => {
        if (!title) {
            message.error(t('MyNotes.SendPage.tipNoTitle'))
            return;
        }
        if (!authorName) {
            message.error(t('MyNotes.SendPage.PublishToTopic.tipNoAuthorName'))
            return;
        }
        if (!content) {
            message.error(t('MyNotes.SendPage.PublishToTopic.tipNoContent'))
            return;
        }

        let params = {
            title,
            content,
            authorName,
            noteId
        }
        console.log(params)
        setSaving(true)
        apiWebPublishNoteToTopic(params).then((res: any) => {
            if (res.code === 0) {
                message.success(t('MyNotes.SendPage.PublishToTopic.tipPublishTopicSuccess'))
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
        <div>
            <Breadcrumb items={[
                {
                    title: t("common.home"),
                    href: "/main/dashboard"
                },
                {
                    title: t("MyNotes.noteList"),
                    href: "/main/noteList"
                },
                {
                    title: t("MyNotes.noteEdit"),
                    href: "/main/NoteEdit"
                },
                {
                    title: t("MyNotes.publishToTopic")
                }
            ]}/>

            <div style={{}}>
                {/*说明*/}
                <div style={{
                    border: '1px solid red',
                    borderColor: themeColor.textLight,
                    borderRadius: 5,
                    padding: 10,
                    marginTop: 20
                }}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <SmileTwoTone style={{fontSize: 24}}/>
                        <div style={{
                            color: themeColor.textLight,
                            marginLeft: 10,
                            fontSize: 20
                        }}> {t('MyNotes.SendPage.PublishToTopic.tipPublishToTopic')}</div>
                    </div>
                    <div style={{
                        marginTop: 10,
                        color: themeColor.textLight
                    }}> {t('MyNotes.SendPage.PublishToTopic.tipPublishToTopic1')}</div>
                    <div style={{
                        marginTop: 10,
                        color: themeColor.textHolder
                    }}> {t('MyNotes.SendPage.PublishToTopic.tipPublishToTopic2')}</div>
                </div>

                <div style={{
                    border: '1px solid red',
                    borderColor: themeColor.textLight,
                    borderRadius: 5,
                    padding: 10,
                    marginTop: 20,
                    marginRight: 10
                }}>
                    <Form style={{marginTop: 20}}>
                        {/*title*/}
                        <Form.Item>
                            <div
                                style={{color: themeColor.textLight}}>{t('MyNotes.SendPage.PublishToTopic.title')}</div>
                            <Input style={{marginTop: 5}} value={title} onChange={(e: any) => {
                                setTitle(e.target.value);
                            }}/>
                            <div style={{color: themeColor.textHolder, marginTop: 5}}>
                                {t('MyNotes.SendPage.PublishToTopic.tipTitle')}</div>
                        </Form.Item>

                        {/*Author name*/}
                        <Form.Item>
                            <div
                                style={{color: themeColor.textLight}}> {t('MyNotes.SendPage.PublishToTopic.authorName')}</div>
                            <Input
                                style={{marginTop: 5}}
                                onChange={e => setAuthorName(e.target.value)}
                                value={authorName}
                            />
                            <div
                                style={{
                                    color: themeColor.textHolder,
                                    marginTop: 5
                                }}>  {t('MyNotes.SendPage.PublishToTopic.tipAuthorName')}</div>
                        </Form.Item>

                        <Form.Item>
                            <div
                                style={{color: themeColor.textLight}}> {t('MyNotes.SendPage.PublishToTopic.publishContent')}</div>
                            <Input.TextArea
                                style={{marginTop: 5}}
                                autoSize={true} value={content} onChange={(e: any) => {
                                setContent(e.target.value)
                            }}/>
                            <div
                                style={{
                                    color: themeColor.textHolder,
                                    marginTop: 5
                                }}> {t('MyNotes.SendPage.PublishToTopic.tipContent')}</div>
                        </Form.Item>
                    </Form>

                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        {saving ?
                            <Button type="primary"
                                    loading>{t('MyNotes.SendPage.PublishToTopic.btPublishing')}
                            </Button> :
                            <Button type='primary' onClick={() => {
                                onSend();
                            }}> {t('MyNotes.SendPage.PublishToTopic.btPublish')}</Button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PublishToTopic
