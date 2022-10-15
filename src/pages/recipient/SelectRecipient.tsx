import {Button, Card, Divider, Form, Input, message, Modal, Spin} from "antd";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {apiAddEmailToRecipient, apiListMyContact, apiSaveMyContact} from "../../api/Api";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import RecipientRow from "../trigger/RecipientRow";
import {saveContactList, saveTotalContact} from "../../store/contactSlice";

const SelectRecipient = () => {
    const {noteId}: any = useLocation().state;
    const {t} = useTranslation();
    const [modalEditRecipient, setModalEditRecipient] = useState(false);
    const [contactName, setContactName] = useState("");
    const [phone, setPhone] = useState("");
    const [editing, setEditing] = useState(false);
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const contactPageIndex =
        useSelector((state: any) => state.contactSlice.contactPageIndex) || 1;
    const contactPageSize =
        useSelector((state: any) => state.contactSlice.contactPageSize) || 10;
    const contactList =
        useSelector((state: any) => state.contactSlice.contactList) || [];
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
    const [loading, setLoading] = useState(true);
    const [remark, setRemark] = useState("");
    const [saving, setSaving] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        return () => {
            loadAllData();
        };
    }, [contactPageIndex]);

    const loadAllData = () => {
        let params = {
            pageIndex: contactPageIndex,
            pageSize: contactPageSize,
        };
        setLoading(true);
        apiListMyContact(params).then((res: any) => {
            if (res.code === 0) {
                dispatch(saveContactList(res.data.contactList));
                dispatch(saveTotalContact(res.data.totalContact));
                setLoading(false);
            }
        });
    };

    const onAddToRecipient = () => {
        if (!email) {
            message.error(t('recipient.tipNoEmail'))
            return
        }
        let params = {
            email,
            noteId
        }
        setSaving(true)
        apiAddEmailToRecipient(params).then((res: any) => {
            if (res.code === 0) {
                message.success(t('recipient.tipAddSuccess'))
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

    const onSaveContact = () => {
        let params = {
            contactName,
            phone,
            email,
            remark,
        };
        apiSaveMyContact(params)
            .then((res: any) => {
                if (res.code === 0) {
                    message.success(t("contact.tipContactSaveSuccess"));
                    loadAllData();
                    setModalEditRecipient(false);
                } else {
                    message.error(t("syserr." + res.code));
                }
            })
            .catch(() => {
                message.error(t("syserr.10001"));
            });
    };

    return (
        <div>
            {/*添加接收人*/}
            <Card title={t('recipient.addRecipient')} headStyle={{color: themeColor.textLight}}
                  style={{background: themeColor.blockDark, color: themeColor.textLight}}>
                <Form style={{color: 'red'}}>
                    <Form.Item style={{color: themeColor.textLight}}>
                        <div>{t('recipient.recipientEmail')}</div>
                        <Input onChange={(e) => {
                            setEmail(e.target.value)
                        }}/>
                        <div style={{color: themeColor.dangerColor1}}></div>
                    </Form.Item>
                </Form>
                <Button type="primary" onClick={() => {
                    onAddToRecipient()
                }}>{t('recipient.btAddToRecipient')}</Button>
            </Card>

            <div style={{
                borderBottom: `1px solid ${themeColor.textLight}`,
                color: themeColor.textLight,
                marginTop: 20
            }}>{t('recipient.recentRecipient')}</div>

            {loading ? (
                <div
                    style={{display: "flex", justifyContent: "center", marginTop: 100}}
                >
                    <Spin/>
                </div>
            ) : (
                <>
                    {contactList.length === 0 ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 20,
                                padding: 20,
                            }}
                        >
                            <div style={{color: themeColor.textLight}}>
                                {t("contact.tipAddContact1")}
                            </div>
                            <div>
                                <Button
                                    style={{marginTop: 20}}
                                    type="primary"
                                    onClick={() => {
                                        setModalEditRecipient(true);
                                    }}
                                >
                                    {t("contact.btNewContact")}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {contactList.map((item: any, index: any) => (
                                <RecipientRow item={item} noteId={noteId} key={index}/>
                            ))}
                        </>
                    )}
                </>
            )}

            <Modal
                visible={modalEditRecipient}
                closable={false}
                maskClosable={false}
                onCancel={() => setModalEditRecipient(false)}
                onOk={() => {
                    onSaveContact();
                }}
                bodyStyle={{background: themeColor.blockDark}}
            >
                <Form style={{marginTop: 20, background: themeColor.blockDark}}>
                    <Form.Item>
                        <div style={{color: themeColor.textLight}}>
                            {t("contact.contactName")}
                        </div>
                        <Input
                            style={{
                                background: themeColor.blockDark,
                                color: themeColor.textLight,
                            }}
                            placeholder={t("contact.contactNameHolder")}
                            onChange={(e) => {
                                setContactName(e.target.value);
                                setEditing(true);
                            }}
                            value={contactName}
                        />
                    </Form.Item>
                    <Form.Item>
                        <div style={{color: themeColor.textLight}}>
                            {t("contact.contactPhone")}
                        </div>
                        <Input
                            style={{
                                background: themeColor.blockDark,
                                color: themeColor.textLight,
                            }}
                            placeholder={t("contact.phoneHolder")}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                setEditing(true);
                            }}
                            value={phone}
                        />
                    </Form.Item>
                    <Form.Item>
                        <div style={{color: themeColor.textLight}}>
                            {t("contact.contactEmail")}
                        </div>
                        <Input
                            style={{
                                background: themeColor.blockDark,
                                color: themeColor.textLight,
                            }}
                            placeholder={t("contact.emailHolder")}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEditing(true);
                            }}
                            value={email}
                        />
                    </Form.Item>
                    <Form.Item>
                        <div style={{color: themeColor.textLight}}>
                            {t("contact.contactRemark")}
                        </div>
                        <Input.TextArea
                            style={{
                                background: themeColor.blockDark,
                                color: themeColor.textLight,
                            }}
                            autoSize={{minRows: 3}}
                            value={remark}
                            onChange={(e) => {
                                setRemark(e.target.value);
                            }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default SelectRecipient;
