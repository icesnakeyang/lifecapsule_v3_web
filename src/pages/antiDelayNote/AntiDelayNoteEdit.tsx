import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {apiGetMyAntiDelayNote, apiRequestRsaPublicKey, apiUpdateMyAntiDelayNote} from "../../api/Api";
import {Decrypt, Decrypt2, Encrypt, GenerateKey, GenerateRandomString16, RSAencrypt} from "../../common/crypto";
import {Breadcrumb, Button, Card, Col, Input, message, Row} from "antd";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {saveAntiDelayTodoListEdit} from "../../store/antiDelaySlice";
import {CheckOutlined, CloseOutlined, PlusSquareOutlined} from "@ant-design/icons";
import AntiDelayTodoTaskRow from "./AntiDelayTodoTaskRow";
import CryptoJS from "crypto-js";
import {loadRefresh} from "../../store/commonSlice";
import moment from "moment";

const AntiDelayNoteEdit = (data: any) => {
    const {antiDelayNoteId}: any = useLocation().state;
    const {t} = useTranslation()
    const [happyYesterday, setHappyYesterday] = useState('')
    const [myThought, setMyThought] = useState('')
    const [longGoal, setLongGoal] = useState('')
    const [todayGoal, setTodayGoal] = useState('')
    const [title, setTitle] = useState('')
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const dispatch = useDispatch()
    const antiDelayTodoListEdit = useSelector(
        (state: any) => state.antiDelaySlice.antiDelayTodoListEdit,
    );
    const [addingTask, setAddingTask] = useState(false)
    const [taskTodoTitle, setTaskTodoTitle] = useState('');
    const [saving, setSaving] = useState(false)
    const navigate = useNavigate()
    const [createTime, setCreateTime] = useState(null)

    useEffect(() => {
        loadAllData()
    }, [])

    const loadAllData = () => {
        let params = {
            noteId: antiDelayNoteId,
            encryptKey: {},
            keyToken: "",
        }
        apiRequestRsaPublicKey().then((res1: any) => {
            if (res1.code === 0) {
                const keyAES_1 = GenerateRandomString16();
                params.encryptKey = RSAencrypt(keyAES_1, res1.data.publicKey);
                params.keyToken = res1.data.keyToken;

                apiGetMyAntiDelayNote(params).then((res: any) => {
                    if (res.code === 0) {
                        let strKey = res.data.userEncodeKey
                        strKey = Decrypt2(strKey, keyAES_1);
                        let yesterday = Decrypt(res.data.HAPPY_YESTERDAY.content, strKey, strKey);
                        console.log(yesterday)
                        let LONG_GOAL = Decrypt(res.data.LONG_GOAL.content, strKey, strKey);
                        let MY_THOUGHT = Decrypt(res.data.MY_THOUGHT.content, strKey, strKey);
                        let TODAY_GOAL = Decrypt(res.data.TODAY_GOAL.content, strKey, strKey);
                        console.log(LONG_GOAL)
                        console.log(TODAY_GOAL)
                        setHappyYesterday(yesterday)
                        setMyThought(MY_THOUGHT)
                        setLongGoal(LONG_GOAL)
                        setTodayGoal(TODAY_GOAL)
                        setTitle(res.data.title)
                        setCreateTime(res.data.createTime)
                        dispatch(saveAntiDelayTodoListEdit(res.data.todoList));
                    } else {
                        message.error(t('syserr.' + res.code))
                    }
                }).catch(() => {
                    message.error(t('syserr.10001'))
                })
            } else {
                message.error(t('syserr.' + res1.code))
            }
        }).catch(() => {
            message.error(t('syserr.10001'))
        })
    }

    const onAddTask = () => {
        let list: any = [];
        let cc = 0;
        antiDelayTodoListEdit.map((reduxRow: any) => {
            if (reduxRow.taskTitle === taskTodoTitle) {
                cc++;
            }
            list.push(reduxRow);
        });
        if (cc === 0) {
            list.push({taskTitle: taskTodoTitle});
        }
        dispatch(saveAntiDelayTodoListEdit(list));
        setTaskTodoTitle('');
        setAddingTask(false);
    };

    const onSaveAntiDelayNote = () => {
        if (!title) {
            message.error(t('antiDelayNote.tipNoTitle'))
            return;
        }
        let params = {
            title,
            happyYesterday,
            myThought,
            longGoal,
            tasks: antiDelayTodoListEdit,
            todayGoal,
            encryptKey: {},
            keyToken: '',
            noteId: antiDelayNoteId
        };
        setSaving(true);

        const uuid = GenerateKey();
        const keyAES = CryptoJS.SHA256(uuid);
        const keyAESBase64 = CryptoJS.enc.Base64.stringify(keyAES);
        params.happyYesterday = Encrypt(happyYesterday, keyAESBase64, keyAESBase64);
        params.myThought = Encrypt(myThought, keyAESBase64, keyAESBase64);
        params.longGoal = Encrypt(longGoal, keyAESBase64, keyAESBase64);
        params.todayGoal = Encrypt(todayGoal, keyAESBase64, keyAESBase64);
        params.encryptKey = keyAESBase64;

        apiRequestRsaPublicKey()
            .then((res1: any) => {
                if (res1.code === 0) {
                    params.encryptKey = RSAencrypt(
                        params.encryptKey,
                        res1.data.publicKey,
                    );
                    params.keyToken = res1.data.keyToken;

                    apiUpdateMyAntiDelayNote(params)
                        .then((res: any) => {
                            if (res.code === 0) {
                                dispatch(loadRefresh());
                                message.success(t('antiDelayNote.tipSaveAntiDelayNoteSuccess'))
                                navigate(-1)
                            } else {
                                message.error(t('syserr.' + res.code))
                                setSaving(false);
                            }
                        })
                        .catch(() => {
                            message.error(t('syserr.10001'))
                            setSaving(false);
                        });
                } else {
                    message.error(t('syserr.' + res1.code))
                    setSaving(false);
                }
            })
            .catch(() => {
                message.error(t('syserr.10001'))
                setSaving(false);
            });
    };

    return (
        <div>
            <Breadcrumb style={{margin: "20px 0"}} items={[
                {
                    title: t("common.home"),
                    href: '/main/dashboard'
                },
                {
                    title: t("antiDelayNote.antiDelayNoteList"),
                    href: '/main/AntiDelayNoteList'
                },
                {
                    title:t('antiDelayNote.antiProcrastination')
                }
            ]}/>
            <div style={{color: themeColor.textHolder}}>{t('antiDelayNote.antiDelayTile')}</div>
            <div style={{marginTop: 10}}>
                <Input.TextArea autoSize style={{
                    color: themeColor.textLight,
                    background: themeColor.blockDark,
                    fontSize: 16
                }}
                                value={title} onChange={e => {
                    setTitle(e.target.value)
                }}/>
            </div>

            <div style={{marginTop: 20, color: themeColor.textHolder}}>
                {t('note.createTime')}:
                {createTime && moment(createTime).format('LL')}
            </div>

            <Row gutter={16}>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Card size='small' style={{marginTop: 20, background: themeColor.blockDark, color: themeColor.textLight}}
                          headStyle={{color: themeColor.textHolder}} title={t('antiDelayNote.yesterday')}>
                        <Input.TextArea autoSize style={{background: themeColor.blockDark, color: themeColor.textLight}}
                                        onChange={e => {
                                            setHappyYesterday(e.target.value)
                                        }}
                                        value={happyYesterday}/>
                        <div style={{marginTop: 10, color:themeColor.textHolder}}>{t('antiDelayNote.tipYesterday')}</div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Card size='small' style={{marginTop: 20, background: themeColor.blockDark, color: themeColor.textLight}}
                          title={t('antiDelayNote.myThought')}
                          headStyle={{color: themeColor.textHolder}}
                    >
                        <Input.TextArea autoSize style={{background: themeColor.blockDark, color: themeColor.textLight}}
                                        value={myThought} onChange={e => {
                            setMyThought(e.target.value)
                        }}/>
                        <div style={{marginTop: 10,color:themeColor.textHolder}}>{t('antiDelayNote.tipMyThought')}</div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Card size='small' style={{marginTop: 20, background: themeColor.blockDark, color: themeColor.textLight}}
                          title={t('antiDelayNote.longGoal')}
                          headStyle={{color: themeColor.textHolder}}
                    >
                        <Input.TextArea autoSize style={{background: themeColor.blockDark, color: themeColor.textLight}}
                                        value={longGoal}
                                        onChange={e => {
                                            setLongGoal(e.target.value)
                                        }}
                        />
                        <div style={{marginTop: 10, color:themeColor.textHolder}}>{t('antiDelayNote.tipLongGoal1')}</div>
                        <div style={{color:themeColor.textHolder}}>{t('antiDelayNote.tipLongGoal2')}</div>
                        <div style={{color:themeColor.textHolder}}>{t('antiDelayNote.tipLongGoal3')}</div>
                        <div style={{color:themeColor.textHolder}}>{t('antiDelayNote.tipLongGoal4')}</div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Card size='small' style={{marginTop: 20, background: themeColor.blockDark, color: themeColor.textLight}}
                          title={t('antiDelayNote.whatToDoToday')}
                          headStyle={{color: themeColor.textHolder}}
                    >
                        <Input.TextArea autoSize style={{background: themeColor.blockDark, color: themeColor.textLight}}
                                        onChange={e => {
                                            setTodayGoal(e.target.value)
                                        }}
                                        value={todayGoal}/>
                        <div style={{marginTop: 10,color:themeColor.textHolder}}>{t('antiDelayNote.tipTodayGoal')}</div>
                    </Card>
                </Col>
            </Row>

            <Card size='small' style={{marginTop: 20, background: themeColor.blockDark}} title={t('antiDelayNote.10SecAction')}
                  headStyle={{color: themeColor.textLight}}>

                {/* what do you do today */}
                <div style={{marginTop: 0}}>
                    <div style={{color: themeColor.textHolder}}>
                        {t('antiDelayNote.tip10SecAction')}
                    </div>

                    <div style={{marginTop: 10}}>
                        <Button style={{marginTop: 10, background: themeColor.blockDark, borderWidth: 0}}
                                icon={<PlusSquareOutlined style={{color: themeColor.textLight, fontSize: 20}}/>}
                                onClick={() => {
                                    setAddingTask(true)
                                }}>
                        </Button>
                    </div>
                    {addingTask ? (
                        <div
                            style={{display: 'flex', alignItems: 'center'}}>

                            <Input
                                style={{background: themeColor.blockDark, color: themeColor.textLight}}
                                onChange={e => {
                                    setTaskTodoTitle(e.target.value);
                                }}
                                value={taskTodoTitle}
                            />

                            <Button
                                style={{background: themeColor.blockDark, color: themeColor.textLight, marginLeft: 10}}
                                icon={<CheckOutlined/>} onClick={() => {
                                onAddTask()
                            }
                            }/>
                            <Button style={{
                                background: themeColor.blockDark,
                                color: themeColor.textLight,
                                marginLeft: 10
                            }} icon={<CloseOutlined/>} onClick={() => {
                                setAddingTask(false)
                            }}/>
                        </div>
                    ) : null}
                    {antiDelayTodoListEdit.length > 0 ? (
                        antiDelayTodoListEdit.map((item: any, index: any) => (
                            <AntiDelayTodoTaskRow item={item} key={index} method="edit"/>
                        ))
                    ) : (
                        <div style={{marginTop: 10}}>
                            <div style={{color: themeColor.textHolder}}>
                                {t('antiDelayNote.tipAddTodoTask')}
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            <div style={{textAlign: 'center', marginTop: 20}}>
                {saving ?
                    <Button style={{width: 140}} loading size='large' type='primary'>{t('common.btSaving')}</Button> :
                    <Button style={{width: 140}} onClick={() => {
                        onSaveAntiDelayNote()
                    }} size='large' type='primary'>{t('common.btSave')}</Button>
                }
            </div>

        </div>
    )
}
export default AntiDelayNoteEdit
