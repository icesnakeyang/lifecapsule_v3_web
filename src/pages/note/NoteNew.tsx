import {useEffect, useState} from "react";
import {Breadcrumb, Button, Divider, Form, Input, message, Modal, Radio, Select, Space} from "antd";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {apiRequestRsaPublicKey, apiSaveMyNote, apiSaveMyNoteTags} from "../../api/Api";
import {Encrypt, GenerateKey, RSAencrypt} from "../../common/crypto";
import CryptoJS from "crypto-js";
import NoteEditTagRow from "./NoteEditTagRow";
import NoteEditTagRowEdit from "./NoteEditTagRowEdit";
import HotTags1 from "../components/HotTags1";
import MyNoteTags1 from "../components/MyNoteTags1";
import {saveEditTags} from "../../store/tagSlice";

const NoteNew = () => {
    const {t} = useTranslation();
    const [title, setTitle] = useState("");
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const currentCategoryId = useSelector(
        (state: any) => state.noteDataSlice.currentCategoryId
    );
    const categoryList = useSelector(
        (state: any) => state.noteDataSlice.categoryList
    );
    const [content, setContent] = useState("");
    const dispatch = useDispatch();
    const [encrypt, setEncrypt] = useState(1);
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
    const editTags = useSelector((state: any) => state.tagSlice.editTags)

    const [modalTag, setModalTag] = useState(false)
    const [tagEdit, setTagEdit] = useState('')

    const onSaveNote = () => {
        let params = {
            title,
            categoryId: currentCategoryId,
            encrypt,
            content: "",
            encryptKey: "",
            keyToken: "",
            tagList: editTags
        };
        setSaving(true);
        if (encrypt === 1) {
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
                                    message.success(t("note.tipNoteSaveSuccess"));
                                    let noteId = res.data.noteId;
                                    navigate("/main/noteEdit", {state: {noteId}});
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
            apiSaveMyNote(params)
                .then((res: any) => {
                    if (res.code === 0) {
                        message.success(t("note.tipNoteSaveSuccess"));
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

    const onAddTag = () => {
        if (!tagEdit) {
            return
        }
        if (!editTags || editTags.length === 0) {
            let list = [{tagName: tagEdit}]
            dispatch(saveEditTags(list))
        } else {
            let cc = 0;
            let tags = []
            editTags.map((item: any) => {
                tags.push(item)
                if (item.tagName === tagEdit) {
                    cc++
                }
            })
            if (cc === 0) {
                tags.push({tagName: tagEdit})
            }
            dispatch(saveEditTags(tags))
        }
    }

    useEffect(() => {
    }, [])

    return (
        <div>
            <Breadcrumb style={{margin: "20px 0"}} items={[
                {
                    title: t("common.home"),
                    href: '/main/dashboard'
                },
                {
                    title: t("note.noteList"),
                    href: '/main/noteList'
                },
                {
                    title: t("note.noteNew")
                }
            ]}/>

            <Form style={{marginTop: 20}} layout="vertical">
                <Form.Item>
                    <div style={{color: themeColor.textLight}}>{t("note.title")}</div>
                    <Input
                        style={{
                            background: themeColor.blockDark,
                            color: themeColor.textLight,
                        }}
                        placeholder={t("note.titleHolder")}
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
                                {t('note.editTag')}
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
                    <div style={{color: themeColor.textLight}}>{t("note.content")}</div>
                    <Input.TextArea
                        style={{
                            background: themeColor.blockDark,
                            color: themeColor.textLight,
                        }}
                        autoSize={{minRows: 3}}
                        value={content}
                        placeholder={t("note.titleHolder")}
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
                        {t("common.btSave")}
                    </Button>
                )}
            </div>

            <Modal
                open={modalTag}
                closable={false}
                onOk={() => {
                    // onSaveTags()
                    setModalTag(false)
                }}
                cancelButtonProps={{style: {display: "none"}}}
            >
                <Form>
                    <Form.Item>
                        <div>{t('note.addTag')}</div>
                        <Space.Compact>
                            {/*<Input style={{width: 'calc(100% - 100px)'}} value={tagEdit} onChange={(e) => {*/}
                            <Input style={{width: '100%'}} value={tagEdit} onChange={(e) => {
                                setTagEdit(e.target.value)
                            }}/>
                            <Button type='primary' onClick={() => onAddTag()}>{t('common.btAdd')}</Button>
                        </Space.Compact>

                    </Form.Item>
                </Form>
                <div>
                    {editTags.length > 0 ? editTags.map((item: any, index: any) => (
                        <NoteEditTagRowEdit item={item} key={index}/>
                    )) : null}
                </div>
                <Divider/>
                <div>
                    <div>{t('tag.myTags')}</div>
                    <div>
                        <MyNoteTags1/>
                    </div>
                </div>
                <Divider/>
                <div>
                    <div>{t('tag.hotTags')}</div>
                    <div style={{marginTop: 10}}>
                        <HotTags1/>
                    </div>
                </div>
            </Modal>

        </div>
    );
};

export default NoteNew;
