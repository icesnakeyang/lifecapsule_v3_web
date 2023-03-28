import {useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {apiGetMyReceiveNote, apiRequestRsaPublicKey} from "../../api/Api";
import {Button, Card, Col, Input, message, Row, Spin, Typography} from "antd";
import {useTranslation} from "react-i18next";
import moment from "moment";
import {useSelector} from "react-redux";
import {
    Decrypt,
    Decrypt2,
    GenerateRandomString16,
    RSAencrypt,
} from "../../common/crypto";
import CryptoJS from "crypto-js";

const MyReceiveNoteDetail = () => {
    const {sendLogId}: any = useLocation().state;
    const {t} = useTranslation();
    const [loading, setLoading] = useState(true);
    const [sendLog, setSendLog] = useState<any>();
    const [decode, setDecode] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
    const [decoding, setDecoding] = useState(false);
    const [triggerType, setTriggerType] = useState("");

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = () => {
        let params = {
            sendLogId,
            encryptKey: {},
            keyToken: "",
        };
        apiRequestRsaPublicKey().then((res: any) => {
            if (res.code === 0) {
                const keyAES_1 = GenerateRandomString16();
                params.encryptKey = RSAencrypt(keyAES_1, res.data.publicKey);
                params.keyToken = res.data.keyToken;

                apiGetMyReceiveNote(params)
                    .then((res: any) => {
                        if (res.code === 0) {
                            let data = res.data;
                            setTriggerType(data.triggerType);
                            if (data.userEncodeKey) {
                                // setEncrypt(0);

                                let strKey = data.userEncodeKey;
                                strKey = Decrypt2(strKey, keyAES_1);
                                let content = Decrypt(data.content, strKey, strKey);
                                // setEncrypt(1);
                                setNoteContent(content);
                            } else {
                                // setEncrypt(0);
                                setNoteContent(data.content);
                            }

                            setSendLog(res.data);
                            setLoading(false);
                        } else {
                            message.error(t("syserr." + res.code));
                        }
                    })
                    .catch(() => {
                        message.error(t("syserr.10001"));
                    });
            }
        });
    };

    const onDecode = () => {
        if (!decode) {
            return;
        }
        if (sendLog && sendLog.content) {
            try {
                setDecoding(true);
                const keyAES = CryptoJS.SHA256(decode);
                const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
                let content = Decrypt(sendLog.content, keyAESBase64, keyAESBase64);
                setNoteContent(content);
                setDecoding(false);
            } catch (err) {
            }
        }
    };

    return (
        <div style={{}}>
            {loading ? (
                <div
                    style={{display: "flex", justifyContent: "center", marginTop: 200}}
                >
                    <Spin/>
                </div>
            ) : (
                <div>
                    <div style={{}}>
                        <Card style={{background: themeColor.blockDark}}>
                            <div style={{color: themeColor.textLight}}>{sendLog.title}</div>
                            <div
                                style={{
                                    color: themeColor.textLight,
                                    marginTop: 20,
                                }}
                            >
                                {t("inbox.detail.fromName")}：{sendLog.fromName}
                            </div>
                            <div
                                style={{
                                    color: themeColor.textLight,
                                    marginTop: 20,
                                }}
                            >
                                {t("inbox.detail.sentTime")}：
                                {moment(sendLog.sendTime).format("LLL")}
                            </div>
                            <div style={{color: themeColor.textLight, marginTop: 20}}>
                                {t("inbox.detail.content")}
                            </div>

                            <Input.TextArea
                                style={{
                                    background: themeColor.blockDark,
                                    color: themeColor.textLight,
                                }}
                                value={noteContent}
                            />
                            {triggerType === "INSTANT_MESSAGE" ? (
                                <div style={{marginTop: 40}}>
                                    <div style={{color: themeColor.textHolder}}>
                                        {t("inbox.detail.tipEncrypt")}
                                    </div>

                                    <Row style={{marginTop: 10}} gutter={10}>
                                        <Col style={{display: "flex", alignItems: 'center'}}>
                                            <div style={{color: themeColor.textLight}}>
                                                {t('inbox.detail.decryptionCode')}
                                            </div>
                                        </Col>
                                        <Col>
                                            <Input
                                                placeholder={t('inbox.detail.decryptionCodeHolder')}
                                                onChange={(e) => {
                                                    setDecode(e.target.value);
                                                }}
                                            />
                                        </Col>
                                        <Col>{decoding ? (
                                            <Button type="primary" loading>
                                                Decoding
                                            </Button>
                                        ) : (
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    onDecode();
                                                }}
                                            >
                                                {t("inbox.detail.btDecode")}{" "}
                                            </Button>
                                        )}</Col>
                                    </Row>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};
export default MyReceiveNoteDetail;
