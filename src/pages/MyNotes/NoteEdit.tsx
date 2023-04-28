import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {
    apiDeleteMyNote,
    apiGetMyNote, apiListHotNoteTags, apiListUserNoteTag,
    apiRequestRsaPublicKey,
    apiSaveMyNote, apiSaveMyNoteTags,
} from "../../api/Api";
import {
    Decrypt,
    Decrypt2,
    Encrypt,
    GenerateKey,
    GenerateRandomString16,
    RSAencrypt,
} from "../../common/crypto";
import {useDispatch, useSelector} from "react-redux";
import {saveTagList} from "../../store/noteDataSlice";
import {
    Breadcrumb,
    Button, Divider,
    Form,
    Input,
    message,
    Modal,
    Radio, Space,
    Spin,
    Tooltip,
} from "antd";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {SendOutlined, DeleteOutlined, AimOutlined, CopyOutlined} from "@ant-design/icons";
import CryptoJS from "crypto-js";
import {loadRefresh, saveEditing} from "../../store/commonSlice";
import moment from "moment";
import HotTagRow from "./HotTagRow";
import NoteEditTagRow from "./NoteEditTagRow";
import NoteEditTagRowEdit from "./NoteEditTagRowEdit";
import {saveEditTags} from "../../store/tagSlice";
import {saveSendNote} from "../../store/noteSendSlice";
import MyAllTagRow from "./MyAllTagRow";
import MyNoteTags1 from "../components/MyNoteTags1";
import HotTags1 from "../components/HotTags1";
import TagEditModal from "./tag/TagEditModal";

const NoteEdit = () => {
    const noteId = useSelector((state: any) => state.noteDataSlice.noteId)
    const [title, setTitle] = useState("");
    const [encrypt, setEncrypt] = useState(1);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {t} = useTranslation();
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [content, setContent] = useState("");
    const editingRedux = useSelector((state: any) => state.commonSlice.editing);
    const [createTime, setCreateTime] = useState(null);
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
    const [modalTag, setModalTag] = useState(false)
    const [tagEdit, setTagEdit] = useState('')
    const tagList = useSelector((state: any) => state.noteDataSlice.tagList)
    const [hotTags, setHotTags] = useState([])
    const editTags = useSelector((state: any) => state.tagSlice.editTags)
    const [myNoteTags, setMyNoteTags] = useState([])

    useEffect(() => {
        loadAllData();
        return () => {
        };
    }, [noteId]);

    useEffect(() => {
        dispatch(saveEditing(0));
    }, []);

    useEffect(() => {
        if (editingRedux > 1) {
            setEditing(true);
        } else {
            setEditing(false);
        }
    }, [editingRedux]);

    const loadAllData = () => {
        let params = {
            noteId,
            encryptKey: {},
            keyToken: "",
        };
        apiRequestRsaPublicKey().then((res: any) => {
            if (res.code === 0) {
                const keyAES_1 = GenerateRandomString16();
                params.encryptKey = RSAencrypt(keyAES_1, res.data.publicKey);
                params.keyToken = res.data.keyToken;

                apiGetMyNote(params).then((res: any) => {
                    if (res.code === 0) {
                        let note = res.data.note;
                        setCreateTime(note.createTime);
                        setTitle(note.title);
                        if (note.encrypt === 1) {
                            let strKey = note.userEncodeKey;
                            strKey = Decrypt2(strKey, keyAES_1);
                            let content = Decrypt(note.content, strKey, strKey);
                            setEncrypt(1);
                            setContent(content);
                        } else {
                            setEncrypt(0);
                            setContent(note.content);
                        }

                        dispatch(saveTagList(res.data.noteTagList))
                        dispatch(saveEditTags(res.data.noteTagList))
                    }
                });
            }
        });


    };

    const onSaveNote = () => {
        let params = {
            title,
            noteId,
            encrypt: 1,
            content: "",
            encryptKey: "",
            keyToken: "",
        };
        setSaving(true);
        if (encrypt === 1) {
            /**
             * 1加密，0不加密
             */
            params.encrypt = 1;
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
                        apiSaveMyNote(params)
                            .then((res: any) => {
                                if (res.code === 0) {
                                    message.success(t("MyNotes.tipNoteSaveSuccess"));
                                    // this.$router.back()
                                    setSaving(false);
                                    setEditing(false);
                                    dispatch(saveEditing(1));
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
            params.encrypt = 0;
            params.content = content;
            setSaving(true);
            apiSaveMyNote(params)
                .then((res: any) => {
                    if (res.code === 0) {
                        message.success(t("MyNotes.tipNoteSaveSuccess"));
                    } else {
                        message.error(t("syserr." + res.code));
                    }
                    setEditing(false);
                    setSaving(false);
                })
                .catch(() => {
                    message.error(t("syserr.10001"));
                    setSaving(false);
                });
        }
        // apiSaveMyNote
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

    const onSaveTags = () => {
        /**
         * 保存tag到note
         */
        let params = {
            tagList: editTags,
            noteId
        }
        apiSaveMyNoteTags(params).then((res: any) => {
            if (res.code === 0) {
                dispatch(loadRefresh())
            } else {
                message.error(t('syserr.' + res.code))
            }
        }).catch(() => {
            message.error(t('syserr.10001'))
        })
    }

    return (
        <div
            style={{
                height: "100%",
            }}
        >
            <Breadcrumb items={[
                {
                    title: t("common.home"),
                    href: '/main/dashboard'
                },
                {
                    title: t("MyNotes.noteList"),
                    href: '/main/noteList'
                },
                {
                    title: t("MyNotes.noteEdit")
                }
            ]}/>
            <div>
                {/*toolbar*/}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        margin: "0 20px",
                    }}
                >
                    <Button
                        type="primary"
                        onClick={() => {
                            navigate("/main/noteNew");
                        }}
                    >
                        {t("MyNotes.btNewNote")}
                    </Button>
                    <Button
                        type="primary"
                        style={{marginLeft: "10px"}}
                        icon={<SendOutlined/>}
                        onClick={() => {
                            let data = {
                                content,
                                title
                            }
                            console.log(data)
                            dispatch(saveSendNote(data))
                            navigate("/main/SendPage");
                        }}
                    >
                        {t("MyNotes.NoteEdit.btSend")}
                    </Button>
                    <Button
                        type="primary"
                        danger
                        style={{marginLeft: "10px"}}
                        icon={<DeleteOutlined/>}
                        onClick={() => {
                            setModalDelete(true);
                        }}
                    >
                        {t("common.btDelete")}
                    </Button>
                </div>

                {/*笔记详情*/}
                <div>
                    <Form style={{padding: 0, margin: 10, marginTop: 40}}>
                        {/*title*/}
                        <Form.Item>
                            <div style={{color: themeColor.textLight}}>
                                {t("MyNotes.NoteEdit.title")}
                            </div>
                            <Input
                                style={{
                                    background: themeColor.blockDark,
                                    color: themeColor.textLight,
                                }}
                                value={title}
                                placeholder={t("MyNotes.titleHolder")}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    setEditing(true);
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
                                        # {t('MyNotes.editTag')}
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
                            <div style={{color: themeColor.textLight}}>
                                {t("MyNotes.NoteEdit.createTime")}：{moment(createTime).format("LLL")}
                            </div>
                        </Form.Item>
                        <Form.Item>
                            <div style={{color: themeColor.textLight}}>
                                {t("MyNotes.content")}
                            </div>
                            <Input.TextArea
                                autoSize={true}
                                style={{
                                    color: themeColor.textLight,
                                    backgroundColor: themeColor.blockDark,
                                }}
                                value={content}
                                placeholder={t("MyNotes.titleHolder")}
                                onChange={(e) => {
                                    setContent(e.target.value);
                                    setEditing(true);
                                }}
                            />
                        </Form.Item>

                        <Form.Item></Form.Item>
                        <div
                            style={{
                                width: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                                display: "flex",
                            }}
                        >
                            {saving ? (
                                <Button type="primary" style={{width: "100px"}} loading>
                                    {t("common.btSaving")}
                                </Button>
                            ) : (
                                <>
                                    {editing ? (
                                        <Button
                                            style={{width: "100px"}}
                                            type="primary"
                                            onClick={() => {
                                                onSaveNote();
                                            }}
                                        >
                                            {t("common.btSave")}
                                        </Button>
                                    ) : null}
                                </>
                            )}
                        </div>
                    </Form>
                </div>
            </div>
            <Modal
                open={modalDelete}
                closable={false}
                onOk={() => {
                    let params = {
                        noteId,
                    };
                    setDeleting(true);
                    setModalDelete(false);
                    apiDeleteMyNote(params)
                        .then((res: any) => {
                            if (res.code === 0) {
                                message.success(t("MyNotes.NoteEdit.tipNoteDeleteSuccess"));
                                navigate(-1);
                            } else {
                                message.error(t("syserr." + res.code));
                                setDeleting(false);
                            }
                        })
                        .catch(() => {
                            message.error(t("syserr.10001"));
                            setDeleting(false);
                        });
                }}
                onCancel={() => setModalDelete(false)}
            >
                <p>{t("MyNotes.NoteEdit.tipNoteDelete")}</p>
            </Modal>

            {modalTag ?
                <TagEditModal visible={modalTag} hideModal={() => setModalTag(false)}/> : null}

            {/*<Modal*/}
            {/*    open={modalTag}*/}
            {/*    closable={false}*/}
            {/*    onOk={() => {*/}
            {/*        onSaveTags()*/}
            {/*        setModalTag(false)*/}
            {/*    }}*/}
            {/*    onCancel={() => setModalTag(false)}*/}
            {/*>*/}
            {/*    <Form>*/}
            {/*        <Form.Item>*/}
            {/*            <div>{t('Tag.addTag')}</div>*/}
            {/*            <Space.Compact>*/}
            {/*                <Input style={{width: 'calc(100% - 100px)'}} value={tagEdit} onChange={(e) => {*/}
            {/*                    setTagEdit(e.target.value)*/}
            {/*                }}/>*/}
            {/*                <Button type='primary' onClick={() => onAddTag()}>{t('common.btAdd')}</Button>*/}
            {/*            </Space.Compact>*/}

            {/*        </Form.Item>*/}
            {/*    </Form>*/}
            {/*    <div>*/}
            {/*        {editTags.length > 0 ? editTags.map((item: any, index: any) => (*/}
            {/*            <NoteEditTagRowEdit item={item} key={index}/>*/}
            {/*        )) : null}*/}
            {/*    </div>*/}
            {/*    <Divider/>*/}
            {/*    <div>*/}
            {/*        <div>{t('Tag.myTags')}</div>*/}
            {/*        <div style={{marginTop: 10}}>*/}
            {/*            <MyNoteTags1/>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <Divider/>*/}
            {/*    <div>*/}
            {/*        <div>{t('Tag.hotTags')}</div>*/}
            {/*        <div style={{marginTop: 10}}>*/}
            {/*            <HotTags1/>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</Modal>*/}
        </div>
    );
};
export default NoteEdit;
