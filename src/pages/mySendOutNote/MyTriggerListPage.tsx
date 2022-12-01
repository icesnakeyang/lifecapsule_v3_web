import {Breadcrumb, Button, message, Pagination, Spin} from "antd";
import TriggerRow from "./TriggerRow";
import MySendNoteRow from "../send/MysendNoteRow";
import {
    saveSendNoteList,
    saveSendPageIndex,
    saveSendPageSize,
    saveTotalSendNote,
    saveTotalSendNoteUnread
} from "../../store/noteSendSlice";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {apiListMyNoteSendOutLog, apiListMyTriggerQue} from "../../api/Api";

const MyTriggerListPage = () => {
    const {t} = useTranslation();
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
    const [loading, setLoading] = useState(true);
    const [tabTriggerType, setTabTriggerType] = useState('QUE')
    const [triggerQueIndex, setTriggerQueIndex] = useState(1)
    const [triggerQueSize, setTriggerQueSize] = useState(10)
    const [triggerQueList, setTriggerQueList] = useState([])
    const [sendOutPageIndex, setSendOutPageIndex] = useState(1)
    const [sendOutPageSize, setSendOutPageSize] = useState(10)
    const [totalTriggerQue, setTotalTriggerQue] = useState([])
    const [sendPageIndex, setSendPageIndex] = useState(1)
    const [sendPageSize, setSendPageSize] = useState(10)
    const [sendNoteList, setSendNoteList] = useState([])
    const [totalSendNote, setTotalSendNote] = useState([])
    const [totalSendNoteUnread, setTotalSendNoteUnread] = useState([])

    useEffect(() => {
        loadAllData();
    }, [triggerQueIndex]);

    const loadAllData = () => {
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
            }
        });

        let params2 = {
            pageIndex: triggerQueIndex,
            pageSize: triggerQueSize
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
            <Breadcrumb style={{padding: 10}}>
                <Breadcrumb.Item>
                    <a href="/main/dashboard">
            <span style={{color: themeColor.textLight}}>
              {t("common.home")}
            </span>
                    </a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
          <span style={{color: themeColor.textLight}}>
            {t("nav.mySendNote")}
          </span>
                </Breadcrumb.Item>
            </Breadcrumb>
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
                                                }}>{t('myTrigger.que')}</Button>
                                        <Button
                                            style={{background: themeColor.color2, width: 120, marginLeft: 10}}
                                            onClick={() => {
                                                setTabTriggerType('SEND_OUT')
                                            }}>{t('myTrigger.sendOut')}</Button>
                                    </> :
                                    tabTriggerType === 'SEND_OUT' ?
                                        <>
                                            <Button
                                                style={{width: 120}} onClick={() => {
                                                setTabTriggerType('QUE')
                                            }
                                            }>{t('myTrigger.que')}</Button>
                                            <Button type='primary'
                                                    style={{
                                                        width: 120,
                                                        marginLeft: 10
                                                    }} onClick={() => {
                                                setTabTriggerType('SEND_OUT')
                                            }
                                            }>{t('myTrigger.sendOut')}</Button>
                                        </> : null
                                }
                            </div>
                        </div>
                        <div>lskdjflasdjfl</div>
                        {
                            tabTriggerType === 'QUE' ?
                                <>
                                    <div style={{color: 'red'}}>lkdsjf</div>
                                    {triggerQueList.length > 0 ?
                                        triggerQueList.map((item, index) => (
                                            <TriggerRow item={item} key={index}/>
                                        ))
                                        : 'no trigger to que'
                                    }
                                </>
                                :
                                <div style={{color:'red'}}>
                                'send already'
                                </div>
                        }

                    </div>
                )}
            </div>
        </div>
    )
}
export default MyTriggerListPage
