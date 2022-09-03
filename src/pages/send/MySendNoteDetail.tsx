import { Button, Card, Input, message, Spin } from "antd";
import Item from "antd/lib/list/Item";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { apiGetMyNoteSendOutLog, apiRequestRsaPublicKey } from "../../api/Api";
import {
  Decrypt,
  Decrypt2,
  GenerateRandomString16,
  RSAencrypt,
} from "../../common/crypto";

const MySendNoteDetail = () => {
  const { sendLogId }: any = useLocation().state;
  const { t } = useTranslation();
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

        apiGetMyNoteSendOutLog(params)
          .then((res: any) => {
            console.log(res);
            if (res.code === 0) {
              let data = res.data.noteSendLog;
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

              setSendLog(res.data.noteSendLog);
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
      } catch (err) {}
    }
  };

  return (
    <div style={{}}>
      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 200 }}
        >
          <Spin />
        </div>
      ) : (
        <div>
          <div style={{}}>
            <Card
              style={{
                background: themeColor.blockDark,
                color: themeColor.textLight,
              }}
            >
              <div style={{ fontSize: 20 }}>
                {t("recipient.messageTitle")}：{sendLog.recipientTitle}
              </div>
              <div>
                {t("trigger.triggerType")}：{t("trigger." + triggerType)}
              </div>
              <div
                style={{
                  color: themeColor.textLight,
                  marginTop: 20,
                }}
              >
                {t("noteSend.sendUser")}：{sendLog.sendUserNickname}
              </div>
              <div
                style={{
                  color: themeColor.textLight,
                  marginTop: 20,
                }}
              >
                {t("noteSend.sendTime")}：
                {moment(sendLog.sendTime).format("LLL")}
              </div>
              <div style={{ marginTop: 20, color: themeColor.textLight }}>
                {sendLog.readTime ? <div>已读</div> : <div>未读</div>}
              </div>
              <div style={{ color: themeColor.textLight, marginTop: 20 }}>
                {t("noteSend.content")}
              </div>
              <Input.TextArea
                style={{
                  background: themeColor.blockDark,
                  color: themeColor.textLight,
                }}
                value={noteContent}
              />
              {triggerType === "INSTANT_MESSAGE" ? (
                <div style={{}}>
                  <div style={{ color: themeColor.textHolder }}>
                    {t("noteSend.tipEncrypt")}
                  </div>
                  <Input
                    onChange={(e) => {
                      setDecode(e.target.value);
                    }}
                  />
                  <div
                    style={{
                      marginTop: 20,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {decoding ? (
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
                        {t("noteSend.btDecode")}{" "}
                      </Button>
                    )}
                  </div>
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
export default MySendNoteDetail;
