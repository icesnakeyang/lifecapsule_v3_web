import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {apiGetMyNote, apiGetMyTriggerDetail, apiRequestRsaPublicKey} from "../../api/Api";
import {Decrypt, Decrypt2, GenerateRandomString16, RSAencrypt} from "../../common/crypto";
import {Breadcrumb, Button, Card, DatePicker, Form, Input, message, Spin} from "antd";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import moment from "moment";
import CryptoJS from 'crypto-js'
import dayjs from "dayjs";
import {timePlusDays} from "../../common/common";

const MyTriggerEdit = () => {
    const {triggerId}: any = useLocation().state
    const {t} = useTranslation()
    const [createTime, setCreateTime] = useState(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const [encodeCode, setEncodeCode] = useState('')
    const [toName, setToName] = useState('')
    const [fromName, setFromName] = useState('')
    const [triggerTime, setTriggerTime] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadAllData()
    }, [])

    const loadAllData = () => {
        let params = {
            triggerId,
            encryptKey: {},
            keyToken: "",
        }
        setLoading(true)
        apiRequestRsaPublicKey().then((res2: any) => {
            if (res2.code === 0) {
                const keyAES_1 = GenerateRandomString16();
                params.encryptKey = RSAencrypt(keyAES_1, res2.data.publicKey);
                params.keyToken = res2.data.keyToken;
                apiGetMyTriggerDetail(params).then((res: any) => {
                    if (res.code === 0) {
                        let trigger = res.data.trigger;
                        setCreateTime(trigger.createTime);
                        setTitle(trigger.title);
                        if (trigger.noteContent) {
                            if (trigger.userEncodeKey) {
                                let strKey = trigger.userEncodeKey;
                                strKey = Decrypt2(strKey, keyAES_1);
                                let content = Decrypt(trigger.noteContent, strKey, strKey);
                                setContent(content);
                            } else {
                                setContent(trigger.noteContent);
                            }
                        }
                        setToName(trigger.toName)
                        setFromName(trigger.fromName)
                        if (trigger.triggerTime) {
                            setTriggerTime(trigger.triggerTime)
                        } else {
                            setTriggerTime(timePlusDays(new Date(), 30))
                        }
                        setLoading(false)
                    } else {
                        message.error(t('syserr.' + res.code))
                    }
                }).catch(() => {
                    message.error(t('syserr.10001'))
                })
            } else {
                message.error(t('syserr.' + res2.code))
            }
        }).catch(() => {
            message.error(t('syserr.10001'))
        })
    }

    const onEncodeContent = () => {
        console.log(encodeCode)
        if (content) {
            try {
                const keyAES = CryptoJS.SHA256(encodeCode);
                const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
                let content2 = Decrypt(content, keyAESBase64, keyAESBase64);
                // dispatch(saveReceiveNoteContent(content));
                // dispatch(saveDecrypted(true));
                setContent(content2);
            } catch (err) {
                console.log(err)
            }
        }
    }

    const onUpdate = () => {
        let params = {
            title,
            toName,
            fromName,
            content,
            encodeCode
        }
        console.log(params)
    }

    const onCancel = () => {
        let params = {
            triggerId
        }
        console.log(params)
    }

    return (
        <div style={{background: themeColor.background}}>
            <Breadcrumb items={[
                {
                    title: t('common.home'),
                    href: '/main/dashboard'
                },
                {
                    title: t("nav.mySendNote"),
                    href: '/main/NoteSendList'
                },
                {
                    title: t('nav.mySendNoteDetail')
                }
            ]}/>
            {
                loading ?
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 200}}>
                        <Spin size='large'/>
                    </div>
                    :
                    <>
                        <div style={{marginTop: 20, display: 'flex', justifyContent: 'flex-end'}}>
                            <Button style={{marginLeft: 20}} danger type='primary' onClick={() => {
                                onCancel()
                            }}>{t('MyNoteSend.MyTriggerEdit.btCancel')}</Button>
                        </div>

                        <Card style={{background: themeColor.blockDark, marginTop: 20}}>
                            <Form>
                                <Form.Item>
                                    <div>{t('MyNoteSend.MyTriggerEdit.title')}</div>
                                    <Input.TextArea autoSize={{minRows: 2}} value={title} style={{fontSize: 20}}
                                                    onChange={e => setTitle(e.target.value)}/>
                                </Form.Item>
                                <Form.Item>
                                    <div>{t('MyNoteSend.MyTriggerEdit.createTime')}: {moment(createTime).format('LLL')}</div>
                                </Form.Item>
                                <Form.Item>
                                    <div>{t('MyNoteSend.toName')}</div>
                                    <Input value={toName} onChange={e => setToName(e.target.value)}/>
                                </Form.Item>
                                <Form.Item>
                                    <div>{t('MyNoteSend.fromName')}</div>
                                    <Input value={fromName} onChange={e => setFromName(e.target.value)}/>
                                </Form.Item>
                                <Form.Item>
                                    <DatePicker showTime
                                                defaultValue={dayjs(triggerTime)}
                                                onChange={(e: any) => {
                                                    setTriggerTime(e.toDate())
                                                }}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <div>{t('MyNoteSend.MyTriggerEdit.sendContent')}</div>
                                    <Input.TextArea autoSize={{minRows: 2}} value={content} style={{fontSize: 20}}
                                                    onChange={e => setContent(e.target.value)}/>
                                </Form.Item>
                                <Form.Item>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <div style={{width: 140}}>{t('MyNoteSend.MyTriggerEdit.decode')}</div>
                                        <Input placeholder={t('MyNoteSend.MyTriggerEdit.decryptionCodeHolder')}
                                               value={encodeCode}
                                               onChange={e => setEncodeCode(e.target.value)}/>
                                        <Button type='primary' onClick={() => {
                                            onEncodeContent()
                                        }}>{t('MyNoteSend.MyTriggerEdit.btDecode')}</Button>
                                    </div>
                                </Form.Item>
                            </Form>
                            <Button type='primary' onClick={() => {
                                onUpdate()
                            }}>{t('MyNoteSend.MyTriggerEdit.btUpdate')}</Button>
                        </Card>
                    </>}
        </div>
    )
}
export default MyTriggerEdit
