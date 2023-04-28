import {Breadcrumb, Button, Form, Input, message} from "antd";
import {useTranslation} from "react-i18next";
import {SmileTwoTone} from "@ant-design/icons";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {apiPublishMotto} from "../../../api/Api";
import {useNavigate} from "react-router-dom";

const PublishToMotto = () => {
    const {t} = useTranslation()
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const nickname = useSelector((state: any) => state.userDataSlice.nickname)
    const [authorName, setAuthorName] = useState('')
    const [content, setContent] = useState('')
    const sendNoteContent = useSelector((state: any) => state.noteSendSlice.sendNoteContent)
    const [saving, setSaving] = useState(false)
    const noteId = useSelector((state: any) => state.noteDataSlice.noteId)
    const navigate = useNavigate()

    useEffect(() => {
        setAuthorName(nickname)
        setContent(sendNoteContent)
    }, [])

    const onPublish = () => {
        let params = {
            authorName,
            content,
            noteId
        }
        console.log(params)
        setSaving(true)
        apiPublishMotto(params).then((res: any) => {
            if (res.code === 0) {
                message.success(t('MyNotes.SendPage.PublishToMotto.tipPublishMottoSuccess'))
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
                    title: t("MyNotes.publishToMotto")
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
                        }}> {t('MyNotes.SendPage.PublishToMotto.tipPublishToMotto')}</div>
                    </div>
                    <div style={{
                        marginTop: 10,
                        color: themeColor.textLight
                    }}> {t('MyNotes.SendPage.PublishToMotto.tipPublishToMotto1')}</div>
                    <div style={{
                        marginTop: 10,
                        color: themeColor.textHolder
                    }}> {t('MyNotes.SendPage.PublishToMotto.tipPublishToMotto2')}</div>
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
                        {/*Author name*/}
                        <Form.Item>
                            <div
                                style={{color: themeColor.textLight}}> {t('MyNotes.SendPage.PublishToMotto.authorName')}</div>
                            <Input
                                style={{marginTop: 5}}
                                onChange={e => setAuthorName(e.target.value)}
                                value={authorName}
                            />
                            <div
                                style={{
                                    color: themeColor.textHolder,
                                    marginTop: 5
                                }}>  {t('MyNotes.SendPage.PublishToMotto.tipAuthorName')}</div>
                        </Form.Item>

                        <Form.Item>
                            <div
                                style={{color: themeColor.textLight}}> {t('MyNotes.SendPage.PublishToMotto.mottoContent')}</div>
                            <Input.TextArea
                                style={{marginTop: 5}}
                                autoSize={true} value={content} onChange={(e: any) => {
                                setContent(e.target.value)
                            }}/>
                            <div
                                style={{
                                    color: themeColor.textHolder,
                                    marginTop: 5
                                }}> {t('MyNotes.SendPage.PublishToMotto.mottoContent')}</div>
                        </Form.Item>
                    </Form>

                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        {saving ?
                            <Button type="primary"
                                    loading>{t('MyNotes.SendPage.PublishToMotto.btPublishing')}
                            </Button> :
                            <Button type='primary' onClick={() => {
                                onPublish();
                            }}> {t('MyNotes.SendPage.PublishToMotto.btPublish')}</Button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PublishToMotto
