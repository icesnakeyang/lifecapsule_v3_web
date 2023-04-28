import {Breadcrumb, Button, Card, Col, Input, message, Row} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {apiCreateMyAntiDelayNote, apiLoadLastMyAntiDelayNote, apiRequestRsaPublicKey} from "../../api/Api";
import {Decrypt, Decrypt2, Encrypt, GenerateKey, GenerateRandomString16, RSAencrypt} from "../../common/crypto";
import {CheckOutlined, CloseOutlined, PlusSquareOutlined} from "@ant-design/icons";
import AntiDelayTodoTaskRow from "./AntiDelayTodoTaskRow";
import {clearAntiDelayNoteRedux, saveAntiDelayTodoListNew} from "../../store/antiDelaySlice";
import {loadRefresh} from "../../store/commonSlice";
import {useNavigate} from "react-router-dom";
import CryptoJS from 'crypto-js'

const AntiDelayNoteNew = () => {
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const {t} = useTranslation()
    const [title, setTitle] = useState('')
    const [happyYesterday, setHappyYesterday] = useState('')
    const [myThought, setMyThought] = useState('')
    const [longGoal, setLongGoal] = useState('')
    const [todayGoal, setTodayGoal] = useState('')
    const [taskTodoTitle, setTaskTodoTitle] = useState('');
    const [addingTask, setAddingTask] = useState(false);
    const antiDelayTodoListNew = useSelector(
        (state: any) => state.antiDelaySlice.antiDelayTodoListNew,
    );
    const dispatch = useDispatch();
    const [saving, setSaving] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        loadAllData()
    }, [])

    const loadAllData = () => {
        let params = {
            encryptKey: {},
            keyToken: '',
        };
        apiRequestRsaPublicKey().then((res1: any) => {
            if (res1.code === 0) {
                const keyAES_1 = GenerateRandomString16();
                params.encryptKey = RSAencrypt(keyAES_1, res1.data.publicKey);
                params.keyToken = res1.data.keyToken;

                apiLoadLastMyAntiDelayNote(params).then((res: any) => {
                    if (res.code === 0) {
                        let strKey = res.data.userEncodeKey;
                        strKey = Decrypt2(strKey, keyAES_1);
                        res.data.subList.map((item: any) => {
                            if (item.type === 'LONG_GOAL') {
                                let c1 = Decrypt(item.content, strKey, strKey);
                                setLongGoal(c1)
                            }
                            if (item.type === 'TODAY_GOAL') {
                                let c2 = Decrypt(item.content, strKey, strKey)
                                setTodayGoal(c2)
                            }
                        });
                        //
                    }
                });
            }
        });
    };

    const onAddTask = () => {
        let list: any = [];
        let cc = 0;
        antiDelayTodoListNew.map((reduxRow: any) => {
            if (reduxRow.taskTitle === taskTodoTitle) {
                cc++;
            }
            list.push(reduxRow);
        });
        if (cc === 0) {
            list.push({taskTitle: taskTodoTitle});
        }
        dispatch(saveAntiDelayTodoListNew(list));
        setTaskTodoTitle('');
        setAddingTask(false);
    };

    const onSaveAntiDelayNote = () => {
        if (!title) {
            message.error(t('AntiProcrastination.tipNoTitle'))
            return;
        }
        let params = {
            title,
            happyYesterday,
            myThought,
            longGoal,
            tasks: antiDelayTodoListNew,
            todayGoal,
            encryptKey: {},
            keyToken: '',
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

                    apiCreateMyAntiDelayNote(params)
                        .then((res: any) => {
                            if (res.code === 0) {
                                dispatch(loadRefresh());
                                message.success(t('AntiProcrastination.tipSaveAntiDelayNoteSuccess'))
                                dispatch(clearAntiDelayNoteRedux());
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
            <Breadcrumb style={{}} items={[
                {
                    title: t("common.home"),
                    href: '/main/dashboard'
                },
                {
                    title: t("nav.mySendNote")
                }
            ]}/>

            <div style={{color: themeColor.textLight, marginTop: 20}}>{t('AntiProcrastination.antiDelayTile')}</div>
            <div style={{marginTop: 10}}>
                <Input.TextArea autoSize
                                style={{color: themeColor.textLight, background: themeColor.blockDark, fontSize: 16}}
                                value={title} onChange={e => {
                    setTitle(e.target.value)
                }}/>
            </div>

            <Row gutter={16}>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Card size='small' style={{marginTop: 20, background: themeColor.blockDark, color: themeColor.textLight}}
                          headStyle={{color: themeColor.textLight}} title={t('AntiProcrastination.yesterday')}>
                        <Input.TextArea autoSize style={{background: themeColor.blockDark, color: themeColor.textLight}}
                                        onChange={e => {
                                            setHappyYesterday(e.target.value)
                                        }}
                                        value={happyYesterday}/>
                        <div style={{
                            marginTop: 10,
                            color: themeColor.textHolder
                        }}>{t('AntiProcrastination.tipYesterday')}</div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Card size='small' style={{marginTop: 20, background: themeColor.blockDark, color: themeColor.textLight}}
                          title={t('AntiProcrastination.myThought')}
                          headStyle={{color: themeColor.textLight}}
                    >
                        <Input.TextArea autoSize style={{background: themeColor.blockDark, color: themeColor.textLight}}
                                        value={myThought} onChange={e => {
                            setMyThought(e.target.value)
                        }}/>
                        <div style={{
                            marginTop: 10,
                            color: themeColor.textHolder
                        }}>{t('AntiProcrastination.tipMyThought')}</div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Card size='small' style={{marginTop: 20, background: themeColor.blockDark, color: themeColor.textLight}}
                          title={t('AntiProcrastination.longGoal')}
                          headStyle={{color: themeColor.textLight}}
                    >
                        <Input.TextArea autoSize style={{background: themeColor.blockDark, color: themeColor.textLight}}
                                        value={longGoal}
                                        onChange={e => {
                                            setLongGoal(e.target.value)
                                        }}
                        />
                        <div style={{
                            marginTop: 10,
                            color: themeColor.textHolder
                        }}>{t('AntiProcrastination.tipLongGoal1')}</div>
                        <div style={{color: themeColor.textHolder}}>{t('AntiProcrastination.tipLongGoal2')}</div>
                        <div style={{color: themeColor.textHolder}}>{t('AntiProcrastination.tipLongGoal3')}</div>
                        <div style={{color: themeColor.textHolder}}>{t('AntiProcrastination.tipLongGoal4')}</div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <Card size='small' style={{marginTop: 20, background: themeColor.blockDark, color: themeColor.textLight}}
                          title={t('AntiProcrastination.whatToDoToday')}
                          headStyle={{color: themeColor.textLight}}
                    >
                        <Input.TextArea autoSize style={{background: themeColor.blockDark, color: themeColor.textLight}}
                                        onChange={e => {
                                            setTodayGoal(e.target.value)
                                        }}
                                        value={todayGoal}/>
                        <div style={{
                            marginTop: 10,
                            color: themeColor.textHolder
                        }}>{t('AntiProcrastination.tipTodayGoal')}</div>
                    </Card>
                </Col>
            </Row>

            <Card size='small' style={{marginTop: 20, background: themeColor.blockDark}} title={t('AntiProcrastination.10SecAction')}
                  headStyle={{color: themeColor.textLight}}>
                <div style={{color: themeColor.textHolder}}>
                    {t('AntiProcrastination.tip10SecAction')}
                </div>

                {antiDelayTodoListNew.length > 0 ? (
                    antiDelayTodoListNew.map((item: any, index: any) => (
                        <AntiDelayTodoTaskRow item={item} key={index}/>
                    ))
                ) : (
                    <div style={{marginTop: 10}}>
                        <div style={{color: themeColor.textHolder}}>
                            {t('AntiProcrastination.tipAddTodoTask')}
                        </div>
                    </div>
                )}
                <Button style={{marginTop: 10, background: themeColor.blockDark, borderWidth: 0}}
                        icon={<PlusSquareOutlined style={{color: themeColor.textLight, fontSize: 20}}/>}
                        onClick={() => {
                            setAddingTask(true)
                        }}>
                </Button>
                {addingTask ?
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Input style={{background: themeColor.blockDark, color: themeColor.textLight}}
                               onChange={e => {
                                   setTaskTodoTitle(e.target.value)
                               }
                               }/>
                        <Button style={{background: themeColor.blockDark, color: themeColor.textLight, marginLeft: 10}}
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
                    : null
                }
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
export default AntiDelayNoteNew
