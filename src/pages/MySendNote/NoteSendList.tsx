import {Breadcrumb, Button, message, Pagination, Spin} from "antd";
import TriggerRow from "./TriggerRow";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {apiListMyNoteSendOutLog, apiListMyTriggerQue} from "../../api/Api";
import NoteSendLogRow from "./NoteSendLogRow";
import {
    saveSendPageIndex,
    saveSendPageSize,
    saveSendQuePageIndex,
    saveSendQuePageSize
} from "../../store/noteSendSlice";

const NoteSendList = () => {
    const {t} = useTranslation();
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
    const [loading, setLoading] = useState(true);
    const [tabTriggerType, setTabTriggerType] = useState('QUE')
    const sendQuePageIndex = useSelector((state: any) => state.noteSendSlice.sendQuePageIndex) || 1
    const sendQuePageSize = useSelector((state: any) => state.noteSendSlice.sendQuePageSize) || 10
    const [triggerQueList, setTriggerQueList] = useState([])
    const [sendOutPageIndex, setSendOutPageIndex] = useState(1)
    const [sendOutPageSize, setSendOutPageSize] = useState(10)
    const [totalTriggerQue, setTotalTriggerQue] = useState(0)
    const sendPageIndex = useSelector((state: any) => state.noteSendSlice.sendPageIndex) || 1
    const sendPageSize = useSelector((state: any) => state.noteSendSlice.sendPageSize) || 10
    const [sendNoteList, setSendNoteList] = useState([])
    const [totalSendNote, setTotalSendNote] = useState(0)
    const [totalSendNoteUnread, setTotalSendNoteUnread] = useState([])
    const dispatch = useDispatch()

    /**
     * 读取等待发送的笔记列表
     */
    useEffect(() => {
        loadSendQueData();
    }, [sendQuePageIndex, sendQuePageSize]);

    /**
     * 读取已经发送的笔记列表
     */
    useEffect(() => {
        loadSendOutData()
    }, [sendPageIndex, sendPageSize])

    /**
     * 已经发送的笔记列表
     */
    const loadSendOutData = () => {
        let params = {
            pageIndex: sendPageIndex,
            pageSize: sendPageSize,
        };
        apiListMyNoteSendOutLog(params).then((res: any) => {
            if (res.code === 0) {
                setSendNoteList(res.data.sendNoteList)
                setTotalSendNote(res.data.totalSendNote)
                setTotalSendNoteUnread(res.data.totalSendNoteUnread)
                setLoading(false);
            } else {
                message.error(t('syserr.' + res.code))
            }
        }).catch(() => {
            message.error(t('syserr.10001'))
        })
    }

    /**
     * 读取等待发送的笔记列表
     */
    const loadSendQueData = () => {
        let params2 = {
            pageIndex: sendQuePageIndex,
            pageSize: sendQuePageSize,
            status: 'ACTIVE'
        }
        apiListMyTriggerQue(params2).then((res: any) => {
            if (res.code === 0) {
                setTriggerQueList(res.data.triggerList)
                setTotalTriggerQue(res.data.totalTrigger)
                setLoading(false)
            } else {
                message.error(t('syserr.' + res.code))
                setLoading(false)
            }
        }).catch(() => {
            message.error(t('syserr.10001'))
            setLoading(false)
        })
    };

    return (
        <div style={{}}>
            <Breadcrumb style={{padding: 10}} items={[
                {
                    title: t("common.home"),
                    href: '/main/dashboard'
                },
                {
                    title: t("nav.mySendNote")
                }
            ]}/>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                {loading ? (
                    <Spin style={{marginTop: 200}}/>
                ) : (
                    <div style={{width: "100%"}}>
                        <div style={{display: 'flex'}}>
                            <div>
                                {tabTriggerType === 'QUE' ?
                                    <>
                                        <Button type='primary'
                                                style={{
                                                    background: themeColor.color1,
                                                    width: 120
                                                }}>{t('MyNoteSend.que')}</Button>
                                        <Button
                                            style={{background: themeColor.color2, width: 120, marginLeft: 10}}
                                            onClick={() => {
                                                setTabTriggerType('SEND_OUT')
                                            }}>{t('MyNoteSend.sendOut')}</Button>
                                    </> :
                                    tabTriggerType === 'SEND_OUT' ?
                                        <>
                                            <Button
                                                style={{width: 120}} onClick={() => {
                                                setTabTriggerType('QUE')
                                            }
                                            }>{t('MyNoteSend.que')}</Button>
                                            <Button type='primary'
                                                    style={{
                                                        width: 120,
                                                        marginLeft: 10
                                                    }} onClick={() => {
                                                setTabTriggerType('SEND_OUT')
                                            }
                                            }>{t('MyNoteSend.sendOut')}</Button>
                                        </> : null
                                }
                            </div>
                        </div>
                        {
                            tabTriggerType === 'QUE' ?
                                <>
                                    {triggerQueList.length > 0 ?
                                        <>
                                            {triggerQueList.map((item, index) => (
                                                <TriggerRow item={item} key={index}/>
                                            ))}
                                            <Pagination style={{marginTop: 20}}
                                                        current={sendQuePageIndex}
                                                        total={totalTriggerQue}
                                                        onChange={(page, size) => {
                                                            dispatch(saveSendQuePageIndex(page))
                                                            dispatch(saveSendQuePageSize(size))
                                                        }}
                                            />
                                        </>

                                        : 'no trigger to que'
                                    }
                                </>
                                :
                                <div style={{}}>
                                    {sendNoteList.length > 0 ?
                                        <>
                                            {sendNoteList.map((item: any, index: any) => (
                                                <NoteSendLogRow item={item} key={index}/>
                                            ))}
                                            <Pagination style={{marginTop: 20}} total={totalSendNote}
                                                        current={sendPageIndex}
                                                        onChange={(page, size) => {
                                                            dispatch(saveSendPageIndex(page))
                                                            dispatch(saveSendPageSize(size))
                                                        }}
                                            />
                                        </>
                                        : 'no trigger to send'
                                    }
                                </div>
                        }

                    </div>
                )}
            </div>
        </div>
    )
}
export default NoteSendList
