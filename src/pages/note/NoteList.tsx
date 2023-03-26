import {
    Breadcrumb,
    Button,
    Card,
    Col,
    Input,
    message, Modal,
    Pagination,
    Row,
    Spin,
} from "antd";
import {useState, useEffect} from "react";
import {apiListMyNote, apiListUserNoteTag} from "../../api/Api";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    clearNoteState,
    saveNoteList,
    saveNoteListSearchKey,
    saveNotePageIndex,
    saveNotePageSize,
} from "../../store/noteDataSlice";
import NoteListRow from "./NoteListRow";
import NotePageTagRow from "./NotePageTagRow";
import NotePageModalTagRow from "./NotePageModalTagRow";
import {loadRefresh} from "../../store/commonSlice";
import {PlusOutlined} from "@ant-design/icons";
import Search from "antd/es/input/Search";

const NoteList = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [totalNote, setTotalNote] = useState(0);
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
    const notePageIndex = useSelector(
        (state: any) => state.noteDataSlice.notePageIndex
    );
    const notePageSize = useSelector(
        (state: any) => state.noteDataSlice.notePageSize
    );
    const noteList =
        useSelector((state: any) => state.noteDataSlice.noteList) || [];
    const refresh = useSelector((state: any) => state.commonSlice.refresh)
    const [modalTag, setModalTag] = useState(false)
    const noteListTags = useSelector((state: any) => state.noteDataSlice.noteListTags)
    const [myNoteTags, setMyNoteTags] = useState([])
    const searchKey = useSelector((state: any) => state.noteDataSlice.noteListSearchKey)

    useEffect(() => {
        console.log('set page index to 1')
        // dispatch(saveNotePageIndex(1))
    }, [])
    useEffect(() => {
        console.log('loaddata')
        loadAllData()
    }, [refresh, notePageIndex, notePageSize])

    const loadAllData = () => {
        console.log('load all data')
        let params = {
            pageIndex: notePageIndex,
            pageSize: notePageSize,
            tagList: noteListTags,
            searchKey
        };
        setLoading(true);
        apiListMyNote(params)
            .then((res: any) => {
                if (res.code === 0) {
                    console.log('save note list')
                    dispatch(saveNoteList(res.data.noteList));
                    setTotalNote(res.data.totalNote);
                    setLoading(false);
                } else {
                    message.error(t("syserr." + res.code));
                    if (res.code === 10003) {
                        navigate("/guest/LoginPage");
                    }
                }
            })
            .catch((err) => {
                message.error(t("syserr.10001"));
                setLoading(false);
            });
        apiListUserNoteTag().then((res: any) => {
            if (res.code === 0) {
                setMyNoteTags(res.data.tagList)
            }
        }).catch(() => {
        })
    };

    const getFun = () => {
        setModalTag(false)
    }

    return (
        <div style={{}}>
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
            {loading ? (
                <div
                    style={{
                        marginTop: "200px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Spin></Spin>
                </div>
            ) : (
                <div>
                    <Card style={{background: themeColor.blockDark}}>
                        <Row gutter={[16, 24]}>
                            <Col>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined/>}
                                    onClick={() => {
                                        dispatch(clearNoteState())
                                        navigate("/main/noteNew");
                                    }}
                                >
                                    {t("note.btNewNote")}
                                </Button>
                            </Col>
                            <Col>
                                <Search style={{background: themeColor.blockDark}}
                                        placeholder={t('note.searchHolder')}
                                        onChange={(e) => {
                                            console.log(e.target.value)
                                            dispatch(saveNoteListSearchKey(e.target.value))
                                        }}
                                        allowClear
                                        value={searchKey}
                                        onSearch={() => {
                                            dispatch(loadRefresh())
                                        }}/>
                            </Col>
                            <Col>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <Button type="primary" onClick={() => {
                                        setModalTag(true)
                                    }}
                                    ># {t('tag.tags')}</Button>
                                    <div style={{marginLeft: 10}}>
                                        {noteListTags && noteListTags.length > 0 ?
                                            noteListTags.map((item: any, index: any) => (
                                                <NotePageTagRow item={item} key={index}/>
                                            )) : null}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    <div style={{marginTop: 10}}>
                        <div style={{marginTop: 10}}>
                            {noteList
                                ? noteList.map((item: any, index: any) => (
                                    <NoteListRow item={item} key={index}/>
                                ))
                                : null}
                        </div>
                        <Pagination
                            style={{marginTop: 10, color: themeColor.textLight}}
                            total={totalNote}
                            current={notePageIndex}
                            defaultPageSize={notePageSize}
                            showQuickJumper
                            showTotal={(total) => `${t("note.totalNotes")}: ${total}`}
                            onChange={(page, pz) => {
                                console.log('page:' + page)
                                dispatch(saveNotePageIndex(page));
                                dispatch(saveNotePageSize(pz));
                            }}
                        />
                    </div>
                </div>
            )}

            <Modal open={modalTag} onCancel={() => setModalTag(false)} onOk={() => {
                setModalTag(false)
            }}>
                <div style={{marginLeft: 10}}>
                    {myNoteTags && myNoteTags.length > 0 ?
                        myNoteTags.map((item: any, index: any) => (
                            <NotePageModalTagRow item={item} key={index} getFun={getFun}/>
                        )) : null}
                </div>
            </Modal>
        </div>
    );
};

export default NoteList;
