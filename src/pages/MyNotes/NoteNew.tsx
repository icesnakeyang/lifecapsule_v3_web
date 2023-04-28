import {useState} from "react";
import {Breadcrumb, Button, Form, Input, message, Switch} from "antd";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {apiRequestRsaPublicKey, apiSaveMyNote} from "../../api/Api";
import {Encrypt, GenerateKey, RSAencrypt} from "../../common/crypto";
import CryptoJS from "crypto-js";
import NoteEditTagRow from "./NoteEditTagRow";
import {InfoCircleOutlined} from "@ant-design/icons";
import {saveNoteId} from "../../store/noteDataSlice";
import TagEditModal from "./tag/TagEditModal";

const NoteNew = () => {
    const {t} = useTranslation();
    const [title, setTitle] = useState("");
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const currentCategoryId = useSelector(
        (state: any) => state.noteDataSlice.currentCategoryId
    );
    const [content, setContent] = useState("");
    const dispatch = useDispatch();
    const [encrypt, setEncrypt] = useState(true);
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
    const editTags = useSelector((state: any) => state.tagSlice.editTags)

    const [modalTag, setModalTag] = useState(false)
    const [showTipEncrypt, setShowTipEncrypt] = useState(false)

    const onSaveNote = () => {
        let params = {
            title,
            categoryId: currentCategoryId,
            encrypt,
            content,
            encryptKey: "",
            keyToken: "",
            tagList: editTags
        };
        setSaving(true);
        if (encrypt) {
            /**
             * 加密保存
             */
            const uuid = GenerateKey();
            const keyAES = CryptoJS.SHA256(uuid);
            const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
            params.content = Encrypt(content, keyAESBase64, keyAESBase64);
            params.encryptKey = keyAESBase64;
            apiRequestRsaPublicKey()
                .then((res: any) => {
                    if (res.code === 0) {
                        params.encryptKey =
                            RSAencrypt(params.encryptKey, res.data.publicKey) || "";
                        params.keyToken = res.data.keyToken;
                        console.log(params)
                        apiSaveMyNote(params)
                            .then((res: any) => {
                                if (res.code === 0) {
                                    message.success(t("MyNotes.NoteNew.tipNoteSaveSuccess"));
                                    let noteId = res.data.noteId;
                                    console.log('save note id ' + noteId)
                                    dispatch(saveNoteId(noteId))
                                    console.log('jump to edit')
                                    navigate("/main/noteEdit");
                                } else {
                                    message.error(t("syserr." + res.code));
                                    setSaving(false);
                                }
                            })
                            .catch(() => {
                                message.error(t("syserr.10001"));
                                setSaving(false);
                            });
                    } else {
                        message.error(t("syserr." + res.code));
                        setSaving(false);
                    }
                })
                .catch(() => {
                    message.error(t("syserr.10001"));
                    setSaving(false);
                });
        } else {
            params.encrypt = false
            apiSaveMyNote(params)
                .then((res: any) => {
                    if (res.code === 0) {
                        message.success(t("MyNotes.NoteNew.tipNoteSaveSuccess"));
                        navigate(-1);
                    } else {
                        message.error(t("syserr." + res.code));
                        setSaving(false);
                    }
                })
                .catch(() => {
                    message.error(t("syserr.10001"));
                    setSaving(false);
                });
        }
    };

    const hideModal = () => {
        setModalTag(false);
    };

    return (
        <div>
            <Breadcrumb style={{margin: "20px 0"}} items={[
                {
                    title: t("common.home"),
                    href: '/main/dashboard'
                },
                {
                    title: t("MyNotes.noteList"),
                    href: '/main/noteList'
                },
                {
                    title: t("MyNotes.noteNew")
                }
            ]}/>

            <Form style={{marginTop: 20}} layout="vertical">
                <Form.Item>
                    <div style={{color: themeColor.textLight}}>{t("MyNotes.title")}</div>
                    <Input
                        style={{
                            background: themeColor.blockDark,
                            color: themeColor.textLight,
                        }}
                        placeholder={t("MyNotes.titleHolder")}
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                    />
                </Form.Item>

                {/*tags*/}
                <Form.Item>
                    <div style={{display: "flex", alignItems: 'center'}}>
                        <div style={{}}>
                            <Button type='primary' onClick={() => {
                                setModalTag(true)
                            }}>
                                {t('MyNotes.editTag')}
                            </Button>
                        </div>
                        <div style={{marginLeft: 10}}>
                            {editTags.length > 0 ? editTags.map((item: any, index: any) => (
                                <NoteEditTagRow item={item} key={index}/>
                            )) : null}
                        </div>
                    </div>
                </Form.Item>

                <Form.Item>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div>{t('MyNotes.NoteNew.encrypt')}：</div>
                        <Switch checked={encrypt} onChange={checked => setEncrypt(checked)}/>
                        <div style={{marginLeft: 10}}>
                            {encrypt ? <span>{t('MyNotes.NoteNew.encrypt')}</span> :
                                <span>{t('MyNotes.NoteNew.noEncrypt')}</span>}
                        </div>
                        <InfoCircleOutlined style={{color: themeColor.textHolder, marginLeft: 10, cursor: 'pointer'}}
                                            onClick={() => {
                                                console.log('30岁了')
                                                setShowTipEncrypt(!showTipEncrypt)
                                            }}/>
                    </div>
                    <div style={{
                        color: themeColor.textHolder,
                        marginTop: 10,
                        display: 'flex',
                        alignItems: 'flex-start'
                    }}>
                        {showTipEncrypt ?
                            <div style={{marginLeft: 10, marginTop: 3}}>  {t('MyNotes.NoteNew.tipEncrypt')}</div>
                            : null}
                    </div>
                </Form.Item>

                <Form.Item>
                    <div style={{color: themeColor.textLight}}>{t("MyNotes.content")}</div>
                    <Input.TextArea
                        style={{
                            background: themeColor.blockDark,
                            color: themeColor.textLight,
                        }}
                        autoSize={{minRows: 3}}
                        value={content}
                        placeholder={t("MyNotes.contentHolder")}
                        onChange={(e) => {
                            setContent(e.target.value);
                        }}
                    />
                </Form.Item>
            </Form>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {saving ? (
                    <Button style={{width: "100px"}} type="primary" block loading>
                        {t("common.btSaving")}
                    </Button>
                ) : (
                    <Button
                        style={{width: "100px"}}
                        type="primary"
                        block
                        onClick={() => {
                            onSaveNote();
                        }}
                    >
                        {t("MyNotes.NoteNew.btSaveNewNote")}
                    </Button>
                )}
            </div>

            {modalTag ?
                <TagEditModal visible={modalTag} hideModal={hideModal}/> : null}
        </div>
    );
};

export default NoteNew;
