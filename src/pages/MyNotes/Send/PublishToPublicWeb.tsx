import {useSelector} from "react-redux";
import {Breadcrumb, Button, Form, Input, message} from "antd";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {apiPublishNoteToPublicWeb} from "../../../api/Api";
import {SmileTwoTone} from "@ant-design/icons";

const PublishToPublicWeb = () => {
    const sendNoteTitle = useSelector((state: any) => state.noteSendSlice.sendNoteTitle)
    const sendNoteContent = useSelector((state: any) => state.noteSendSlice.sendNoteContent)
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const {t} = useTranslation()
    const [saving, setSaving] = useState(false)
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const nickname = useSelector((state: any) => state.userDataSlice.nickname)
    const [authorName, setAuthorName] = useState('')
    const noteId = useSelector((state: any) => state.noteDataSlice.noteId)

    useEffect(() => {
        setTitle(sendNoteTitle)
        setContent(sendNoteContent)
        setAuthorName(nickname)
    }, [])

    const onPublish = () => {
        let params = {
            title,
            content,
            authorName,
            noteId
        }
        setSaving(true)
        apiPublishNoteToPublicWeb(params).then((res: any) => {
            if (res.code === 0) {
                message.success(t('MyNotes.SendPage.PublishToPublicWeb.tipPublishToWebSuccess'))
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
                    title: t("MyNotes.publishToPublicWeb")
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
                        }}> {t('MyNotes.SendPage.PublishToPublicWeb.tip1')}</div>
                    </div>
                    <div style={{
                        marginTop: 10,
                        color: themeColor.textLight
                    }}> {t('MyNotes.SendPage.PublishToPublicWeb.tip2')}</div>
                    <div style={{
                        marginTop: 10,
                        color: themeColor.textHolder
                    }}> {t('MyNotes.SendPage.PublishToPublicWeb.tip3')}</div>
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
                                style={{color: themeColor.textLight}}>{t('MyNotes.SendPage.title')}</div>
                            <Input style={{marginTop: 5}} value={title} onChange={(e: any) => {
                                setTitle(e.target.value);
                            }}/>
                            <div style={{color: themeColor.textHolder, marginTop: 5}}>
                                {t('MyNotes.SendPage.PublishToPublicWeb.tipTitle')}</div>
                        </Form.Item>

                        {/*from name*/}
                        <Form.Item>
                            <div
                                style={{color: themeColor.textLight}}> {t('MyNotes.SendPage.PublishToPublicWeb.authorName')}</div>
                            <Input
                                style={{marginTop: 5}}
                                onChange={e => setAuthorName(e.target.value)}
                                value={authorName}
                            />
                            <div
                                style={{
                                    color: themeColor.textHolder,
                                    marginTop: 5
                                }}>  {t('MyNotes.SendPage.PublishToPublicWeb.tipAuthorName')}</div>
                        </Form.Item>

                        <Form.Item>
                            <div
                                style={{color: themeColor.textLight}}> {t('MyNotes.SendPage.PublishToPublicWeb.articleContent')}</div>
                            <Input.TextArea
                                style={{marginTop: 5}}
                                autoSize={true} value={content} onChange={(e: any) => {
                                setContent(e.target.value)
                            }}/>
                        </Form.Item>
                    </Form>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        {saving ?
                            <Button type="primary"
                                    style={{width: 140}}
                                    loading>{t('MyNotes.SendPage.PublishToPublicWeb.btPublishing')}
                            </Button> :
                            <Button style={{width: 140}} type='primary' onClick={() => {
                                onPublish();
                            }}> {t('MyNotes.SendPage.PublishToPublicWeb.btPublish')}</Button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PublishToPublicWeb
