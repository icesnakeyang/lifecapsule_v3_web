import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button, Card, Col, Form, Input, message, Row} from "antd";
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

    return (<div style={{}}>
        <Row gutter={[16, { xs: 2, sm: 2, md: 2, lg: 32 }]}>
            <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={6}>
                <Card style={{minHeight:130}}>
                    <div style={{}}>
                        <Button type='primary' block>{t('note.send.sendInstantly')}</Button>
                    </div>
                    <div>{t('note.send.tipSendInstantly')}</div>
                </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={6} xxl={6}>
                <Card style={{minHeight:130}}>
                    <div>
                        <Button type='primary' style={{background: '#2e9599'}}
                                block onClick={()=>{
                                    navigate("/main/PublishToPublicWeb")
                        }}>{t('note.send.publishToPublic')}</Button>
                    </div>
                    <div>{t('note.send.tipPublishToPublic')}</div>
                </Card>
            </Col>
        </Row>


    </div>)
}
export default SendPage;
