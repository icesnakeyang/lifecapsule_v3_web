import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button, Card, Form, Input, message} from "antd";
import {apiGetMyNote, apiRequestRsaPublicKey, apiWebSendNote} from "../../api/Api";
import {Decrypt, Decrypt2, Encrypt, GenerateRandomString16, RSAencrypt} from "../../common/crypto";
import {useTranslation} from "react-i18next";
import CryptoJS from "crypto-js";

const SendPage = () => {
    const {noteId}: any = useLocation().state;
    const [email, setEmail] = useState('')
    const [codecKey, setCodecKey] = useState('')
    const [sending, setSending] = useState(false)
    const [title, setTitle] = useState('')
    const {t} = useTranslation()
    const navigate = useNavigate()

    useEffect(() => {
    }, [])

    /**
     * 直接把笔记发送给email账号的用户
     */
    const onSendNote = () => {
        if (!email) {
            message.error(t('noteSend.tipNoEmail'))
            return;
        }

        /**
         * 读取笔记内容
         */
        //读取笔记信息
        setSending(true);
        apiRequestRsaPublicKey().then((res: any) => {
            if (res.code === 0) {
                const keyAES_1 = GenerateRandomString16();
                const encryptKey = RSAencrypt(keyAES_1, res.data.publicKey);
                const keyToken = res.data.keyToken;
                apiGetMyNote({
                    encryptKey,
                    keyToken,
                    noteId,
                }).then((res: any) => {
                    if (res.code === 0) {
                        let {content, encrypt, userEncodeKey} = res.data.note;

                        if (content) {
                            if (encrypt === 1) {
                                let strKey = userEncodeKey;
                                strKey = Decrypt2(strKey, keyAES_1);
                                content = Decrypt(content, strKey, strKey);
                            }
                            /**
                             * 使用用户自定义encodeKey来加密content
                             */
                            let params: any = {
                                email,
                                title,
                            };
                            if (codecKey) {
                                // const uuid = GenerateKey();
                                const keyAES = CryptoJS.SHA256(codecKey);
                                // const keyAES = CryptoJS.SHA256(uuid);

                                const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
                                content = Encrypt(content, keyAESBase64, keyAESBase64);
                                params.noteContent = content;
                            } else {
                                params.noteContent = content;
                            }

                            apiWebSendNote(params)
                                .then((res: any) => {
                                    if (res.code === 0) {
                                        message.success(t('noteSend.tipSendSuccess'))
                                        navigate(-1)
                                    } else {
                                        message.error(t('syserr.' + res.code))
                                    }
                                })
                                .catch(() => {
                                    message.error(t('syserr.10001'))
                                });
                        }
                    }
                });
            }
        });
    }

    return (<div>
        <Card>
            <Form>
                <Form.Item>
                    <div>{t('noteSend.receiverEmail')}</div>
                    <Input onChange={(e) => {
                        setEmail(e.target.value)
                    }}/>
                </Form.Item>
                <Form.Item>
                    <div>{t('noteSend.codecKey')}</div>
                    <Input onChange={(e) => {
                        setCodecKey(e.target.value)
                    }}/>
                    <div>{t('noteSend.tipCodecKey')}</div>
                </Form.Item>
                <Form.Item>
                    <div>{t('noteSend.title')}</div>
                    <Input onChange={(e) => {
                        setTitle(e.target.value)
                    }}/>
                </Form.Item>
            </Form>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                {sending ? <Button type='primary' loading>{t('note.btSending')}</Button> :
                    <Button type='primary' onClick={() => {
                        onSendNote()
                    }}>
                        {t('note.btSend')}
                    </Button>}
            </div>
        </Card>
    </div>)
}
export default SendPage;
