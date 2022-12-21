import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Breadcrumb, Button, Card, Col, Divider, Form, Input, message, Modal, Row} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {ExclamationCircleOutlined, SmileTwoTone, TeamOutlined} from "@ant-design/icons";
import {apiCreateTriggerInstant, apiListMyContact, apiRequestRsaPublicKey} from "../../api/Api";
import {Encrypt, GenerateKey, RSAencrypt} from "../../common/crypto";
import CryptoJS from "crypto-js";
import {saveSendNote, saveSendNoteContent, saveSendToEmail, saveSendToName} from "../../store/noteSendSlice";
import SendContactRow from "./SendContactRow";

const InstantSend = () => {
    const {noteId}: any = useLocation().state
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
    const {t} = useTranslation();
    const [title, setTitle] = useState('')
    const [fromName, setFromName] = useState('')
    const [encodeKey, setEncodeKey] = useState('')
    const [saving, setSaving] = useState(false)
    const sendNoteContent = useSelector((state: any) => state.noteSendSlice.sendNoteContent)
    const sendNoteTitle = useSelector((state: any) => state.noteSendSlice.sendNoteTitle)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [content, setContent] = useState('')
    const [modalContact, setModalContact] = useState(false)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [contactList, setContactList] = useState([])
    const sendToName = useSelector((state: any) => state.noteSendSlice.sendToName)
    const sendToEmail = useSelector((state: any) => state.noteSendSlice.sendToEmail)

    useEffect(() => {
        setContent(sendNoteContent)
        setTitle(sendNoteTitle)
        loadAllData()
    }, [])

    const loadAllData = () => {
        let params = {
            pageIndex,
            pageSize
        }
        console.log(params)
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
            message.error(t('noteSent.tipNoTitle'))
            return;
        }
        if (!sendToName) {
            message.error(t('noteSent.tipNoToName'))
            return;
        }
        if (!sendToEmail) {
            message.error(t('noteSent.tipNoEmail'))
            return;
        }
        if (!fromName) {
            message.error(t('noteSent.tipNoFromName'))
            return;
        }
        if (!sendNoteContent) {
            message.error(t('noteSent.tipNoContent'))
            return;
        }

        let params = {
            noteId,
            title,
            toEmail: sendToEmail,
            toName: sendToName,
            fromName,
            encodeKey,
            noteContent: sendNoteContent,
            encryptKey: {},
            keyToken: ''
        }
        console.log(params)

        setSaving(true)

        const uuid = GenerateKey();
        const keyAES = CryptoJS.SHA256(uuid);
        const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
        params.noteContent = Encrypt(params.noteContent, keyAESBase64, keyAESBase64);
        params.encryptKey = keyAESBase64;
        apiRequestRsaPublicKey().then((res: any) => {
            if (res.code === 0) {
                params.encryptKey = RSAencrypt(params.encryptKey, res.data.publicKey);
                params.keyToken = res.data.keyToken;
                apiCreateTriggerInstant(params)
                    .then((res2: any) => {
                        if (res2.code === 0) {
                            message.success(t('noteSent.tipSendSuccess'))
                            if (res2.code === 10002) {
                                navigate('LoginByEmail')
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

    const onSelectContact = (data: any) => {
        console.log('on select contact')
        console.log(data)
        // console.log(item.contactName)
        // console.log(item.email)
        setModalContact(false)
    }

    return (
        <div style={{
            height: "100%",
        }}>
            <Breadcrumb style={{}}>
                <Breadcrumb.Item>
                    <a href="/main/dashboard">
            <span style={{color: themeColor.textLight}}>
              {t("common.home")}
            </span>
                    </a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/main/noteList">
            <span style={{color: themeColor.textLight}}>
              {t("note.noteList")}
            </span>
                    </a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
          <span style={{color: themeColor.textLight}}>
            {t("note.noteEdit")}
          </span>
                </Breadcrumb.Item>
            </Breadcrumb>


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
                        }}> {t('noteSent.tipNoteSend')}</div>
                    </div>
                    <div style={{marginTop: 10, color: themeColor.textLight}}> {t('noteSent.tipNoteSend2')}</div>
                    <div style={{marginTop: 10, color: themeColor.textHolder}}> {t('noteSent.tipNoteSend3')}</div>
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
                                    <div style={{color: themeColor.textLight}}>{t('noteSent.title')}</div>
                                    <Input value={title} onChange={(e: any) => {
                                        setTitle(e.target.value);
                                    }}/>
                                    <div style={{color: themeColor.textHolder}}>
                                        {t('noteSent.tipTitle')}</div>
                                </Form.Item>

                                {/*to name*/}
                                <Form.Item>
                                    <div style={{color: themeColor.textLight}}> {t('noteSent.toName')}</div>
                                    <Row>
                                        <Col span={22}>
                                            <Input
                                                onChange={(e: any) => dispatch(saveSendToName(e.target.value))}
                                                value={sendToName}
                                            />
                                        </Col>
                                        <Col span={2}>
                                            <Button type='primary' onClick={() => {
                                                setModalContact(true)
                                            }}><TeamOutlined/>
                                            </Button>
                                        </Col>
                                    </Row>
                                    <div style={{color: themeColor.textHolder}}>{t('noteSent.tipToName')}</div>
                                </Form.Item>

                                {/*to email*/}
                                <Form.Item>
                                    <div style={{color: themeColor.textLight}}>{t('noteSent.recipientEmail')}</div>
                                    <Input onChange={e => {
                                        dispatch(saveSendToEmail(e.target.value))
                                    }} value={sendToEmail}/>
                                    <div style={{color: themeColor.textHolder}}> {t('noteSent.tipRecipientEmail')}</div>
                                </Form.Item>

                                {/*from name*/}
                                <Form.Item>
                                    <div style={{color: themeColor.textLight}}> {t('noteSent.fromName')}</div>
                                    <Input
                                        onChange={e => setFromName(e.target.value)}
                                        value={fromName}
                                    />
                                    <div style={{color: themeColor.textHolder}}>  {t('noteSent.tipFromName')}</div>
                                </Form.Item>

                                <Form.Item>
                                    <div style={{color: themeColor.textLight}}> {t('noteSent.sendContent')}</div>
                                    <Input.TextArea autoSize={true} value={content} onChange={(e: any) => {
                                        setContent(e.target.value)
                                        console.log(e.target.value)
                                        dispatch(saveSendNoteContent(e.target.value))
                                    }}/>
                                    <div style={{color: themeColor.textHolder}}> {t('noteSent.tipSendContent')}</div>
                                </Form.Item>

                                {/*Encryption*/}
                                <Form.Item>
                                    <div style={{color: themeColor.textLight}}>{t('noteSent.encryptSend')}</div>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <ExclamationCircleOutlined style={{color: 'cornflowerblue'}}/>
                                        <div
                                            style={{
                                                marginLeft: 5,
                                                color: themeColor.textHolder
                                            }}>{t('noteSent.tip2')}</div>
                                    </div>
                                    <Input
                                        placeholder={t('noteSent.encode')}
                                        onChange={(e: any) => setEncodeKey(e.target.value)}
                                        value={encodeKey}
                                    />
                                    <div style={{color: themeColor.textHolder}}>   {t('noteSent.tip1')}</div>
                                    <div style={{color: themeColor.textHolder}}>  {t('noteSent.tipEncodeWarn1')}</div>
                                    <div style={{color: themeColor.textHolder}}>{t('noteSent.tipEncode2')}</div>
                                </Form.Item>
                            </Form>

                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                {saving ?
                                    <Button type="primary"
                                            loading>{t('common.btSaving')}
                                    </Button> :
                                    <Button type='primary' onClick={() => {
                                        onSend();
                                    }}> {t('noteSent.btSend')}</Button>
                                }
                            </div>
                        </div>
                    </Col>

                    <Col span={12}>
                        <Card title={t('noteSent.preview')} style={{marginTop: 20, marginLeft: 10}}>
                            <div style={{
                                fontSize: 20,
                                alignItems: 'center',
                                justifyContent: 'center',
                                display: 'flex',
                                fontWeight: 'bold'
                            }}>{title}</div>
                            <div style={{marginTop: 20}}>{t('noteSent.fromName')}: {fromName}</div>
                            <div>{t('noteSent.toName')}: {sendToName}</div>
                            <Divider/>
                            <Input.TextArea readOnly autoSize value={sendNoteContent}/>
                        </Card>
                    </Col>
                </Row>
            </div>

            <Modal visible={modalContact}
                   onOk={() => {
                       console.log('ok')
                   }}
                   onCancel={() => {
                       setModalContact(false)
                   }}>
                <Card title={t('noteSent.recentContact')}>
                    {contactList.length > 0 ?
                        contactList.map((item: any, index) => (
                            <SendContactRow item={item} key={index} onSelect={onSelectContact}/>
                        )) : null
                    }
                </Card>
            </Modal>
        </div>
    )
}
export default InstantSend
