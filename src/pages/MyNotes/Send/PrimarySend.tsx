import {useDispatch, useSelector} from "react-redux";
import {Breadcrumb, Button, Card, Col, Divider, Form, Input, message, Modal, Row} from "antd";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {SmileTwoTone, TeamOutlined} from "@ant-design/icons";
import {saveSendNoteContent, saveSendToEmail, saveSendToName} from "../../../store/noteSendSlice";
import SendContactRow from "./SendContactRow";
import CryptoJS from "crypto-js";
import {Encrypt, GenerateKey, GenerateRandomString16, RSAencrypt} from "../../../common/crypto";
import {
    apiCreateTriggerDatetime,
    apiCreateTriggerInstant, apiCreateTriggerPrimary,
    apiListMyContact,
    apiRequestRsaPublicKey
} from "../../../api/Api";
import {useNavigate} from "react-router-dom";

const PrimarySend = () => {
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const {t} = useTranslation()
    const sendToName = useSelector((state: any) => state.noteSendSlice.sendToName)
    const [title, setTitle] = useState('')
    const dispatch = useDispatch()
    const [modalContact, setModalContact] = useState(false)
    const sendToEmail = useSelector((state: any) => state.noteSendSlice.sendToEmail)
    const [fromName, setFromName] = useState('')
    const [content, setContent] = useState('')
    const [saving, setSaving] = useState(false)
    const sendNoteContent = useSelector((state: any) => state.noteSendSlice.sendNoteContent)
    const sendNoteTitle = useSelector((state: any) => state.noteSendSlice.sendNoteTitle)
    const [contactList, setContactList] = useState([])
    const navigate = useNavigate()
    const noteId = useSelector((state: any) => state.noteDataSlice.noteId)
    const nickname = useSelector((state: any) => state.userDataSlice.nickname)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    useEffect(() => {
        setTitle(sendNoteTitle)
        setContent(sendNoteContent)
        setFromName(nickname)
        loadAllData()
    }, [])

    const loadAllData = () => {
        let params = {
            pageIndex,
            pageSize
        }
        apiListMyContact(params).then((res: any) => {
            if (res.code === 0) {
                setContactList(res.data.contactList)
            } else {
                message.error(t('syserr.' + res.code))
            }
        }).catch(() => {
            message.error(t('syserr.10001'))
        })
    }

    const onSend = () => {
        if (!title) {
            message.error(t('MyNotes.SendPage.tipNoTitle'))
            return;
        }
        if (!sendToName) {
            message.error(t('MyNotes.SendPage.tipNoToName'))
            return;
        }
        if (!sendToEmail) {
            message.error(t('MyNotes.SendPage.tipNoEmail'))
            return;
        }
        if (!fromName) {
            message.error(t('MyNotes.SendPage.tipNoFromName'))
            return;
        }
        if (!content) {
            message.error(t('MyNotes.SendPage.tipNoContent'))
            return;
        }

        let params = {
            noteId,
            title,
            toEmail: sendToEmail,
            toName: sendToName,
            fromName,
            noteContent: content,
            encryptKey: {},
            keyToken: ''
        }

        setSaving(true)

        //定时发送和主倒计时发送不设置口令，随机生成秘钥，并保存到服务器
        const uuid = GenerateKey();
        const keyAES = CryptoJS.SHA256(uuid);
        const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
        params.noteContent = Encrypt(content, keyAESBase64, keyAESBase64);
        params.encryptKey = keyAESBase64;
        apiRequestRsaPublicKey().then((res: any) => {
            if (res.code === 0) {
                params.encryptKey =
                    RSAencrypt(params.encryptKey, res.data.publicKey);
                params.keyToken = res.data.keyToken;

                apiCreateTriggerPrimary(params)
                    .then((res2: any) => {
                        if (res2.code === 0) {
                            message.success(t('MyNotes.SendPage.PrimarySend.tipCreatePrimarySendSuccess'))
                            if (res2.code === 10002) {
                                navigate('LoginPage')
                            }
                            navigate(-1)
                        } else {
                            message.error(t('syserr.' + res2.code))
                            setSaving(false)
                        }
                    })
                    .catch(() => {
                        message.error(t('syserr.10001'))
                        setSaving(false)
                    });
            } else {
                message.error(t('syserr.' + res.code))
                setSaving(false)
            }
        }).catch(() => {
                message.error(t('syserr.10001'))
                setSaving(false)
            }
        )
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
                    title: t("MyNotes.sendNotePrimary")
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
                        }}> {t('MyNotes.SendPage.PrimarySend.tipSendByPrimary')}</div>
                    </div>
                    <div style={{
                        marginTop: 10,
                        color: themeColor.textLight
                    }}> {t('MyNotes.SendPage.PrimarySend.tipSendByPrimary1')}</div>
                    <div style={{
                        marginTop: 10,
                        color: themeColor.textHolder
                    }}> {t('MyNotes.SendPage.PrimarySend.tipSendByPrimary2')}</div>
                </div>

                <Row>
                    <Col span={12}>
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
                                        {t('MyNotes.SendPage.tipTitle')}</div>
                                </Form.Item>

                                {/*to name*/}
                                <Form.Item>
                                    <div
                                        style={{color: themeColor.textLight}}> {t('MyNotes.SendPage.toName')}</div>
                                    <Row>
                                        <Col span={contactList.length > 0 ? 22 : 24}>
                                            <Input
                                                style={{marginTop: 5}}
                                                onChange={(e: any) => dispatch(saveSendToName(e.target.value))}
                                                value={sendToName}
                                            />
                                        </Col>
                                        {contactList.length > 0 ?
                                            <Col span={2}>
                                                <Button style={{marginTop: 5}} type='primary' onClick={() => {
                                                    if (contactList.length > 0) {
                                                        setModalContact(true)
                                                    }
                                                }}><TeamOutlined/>
                                                </Button>
                                            </Col> : null}
                                    </Row>
                                    <div
                                        style={{
                                            color: themeColor.textHolder,
                                            marginTop: 5
                                        }}>{t('MyNotes.SendPage.tipToName')}</div>
                                </Form.Item>

                                {/*to email*/}
                                <Form.Item>
                                    <div
                                        style={{color: themeColor.textLight}}>{t('MyNotes.SendPage.recipientEmail')}</div>
                                    <Input style={{marginTop: 5}} onChange={e => {
                                        dispatch(saveSendToEmail(e.target.value))
                                    }} value={sendToEmail}/>
                                    <div
                                        style={{
                                            color: themeColor.textHolder,
                                            marginTop: 5
                                        }}> {t('MyNotes.SendPage.tipRecipientEmail')}</div>
                                </Form.Item>

                                {/*from name*/}
                                <Form.Item>
                                    <div
                                        style={{color: themeColor.textLight}}> {t('MyNotes.SendPage.fromName')}</div>
                                    <Input
                                        style={{marginTop: 5}}
                                        onChange={e => setFromName(e.target.value)}
                                        value={fromName}
                                    />
                                    <div
                                        style={{
                                            color: themeColor.textHolder,
                                            marginTop: 5
                                        }}>  {t('MyNotes.SendPage.tipFromName')}</div>
                                </Form.Item>

                                <Form.Item>
                                    <div
                                        style={{color: themeColor.textLight}}> {t('MyNotes.SendPage.sendContent')}</div>
                                    <Input.TextArea
                                        style={{marginTop: 5}}
                                        autoSize={true} value={content} onChange={(e: any) => {
                                        setContent(e.target.value)
                                    }}/>
                                    <div
                                        style={{
                                            color: themeColor.textHolder,
                                            marginTop: 5
                                        }}> {t('MyNotes.SendPage.tipSendContent')}</div>
                                </Form.Item>
                            </Form>

                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                {saving ?
                                    <Button type="primary"
                                            style={{width: 140}}
                                            loading>{t('common.btSaving')}
                                    </Button> :
                                    <Button style={{width: 140}} type='primary' onClick={() => {
                                        onSend();
                                    }}> {t('MyNotes.SendPage.btSend')}</Button>
                                }
                            </div>
                        </div>
                    </Col>

                    <Col span={12}>
                        <Card title={t('MyNotes.SendPage.preview')} style={{marginTop: 20, marginLeft: 10}}>
                            <div style={{
                                fontSize: 20,
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex',
                                fontWeight: 'bold'
                            }}>{title}</div>
                            <div style={{marginTop: 20}}>{t('MyNotes.SendPage.fromName')}: {fromName}</div>
                            <div style={{marginTop: 10}}>{t('MyNotes.SendPage.toName')}: {sendToName}</div>
                            <Divider/>
                            <Input.TextArea readOnly autoSize value={sendNoteContent}/>
                        </Card>
                    </Col>
                </Row>
            </div>

            <Modal open={modalContact}
                   onOk={() => {
                   }}
                   onCancel={() => {
                       setModalContact(false)
                   }}>
                <Card title={t('MyNotes.SendPage.recentContact')}>
                    {contactList.length > 0 ?
                        contactList.map((item: any, index) => (
                            <SendContactRow item={item} key={index} onSelect={() => setModalContact(false)}/>
                        )) : null
                    }
                </Card>
            </Modal>
        </div>
    )
}
export default PrimarySend
