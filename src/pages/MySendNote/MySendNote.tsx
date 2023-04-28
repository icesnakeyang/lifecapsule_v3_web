import {Breadcrumb, Button, Pagination, Spin, Tabs, Tag} from "antd";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {apiListMyNoteSendOutLog, apiListMyTriggerQue} from "../../api/Api";
import {
    saveSendNoteList,
    saveSendPageIndex,
    saveSendPageSize,
    saveTotalSendNote,
    saveTotalSendNoteUnread,
} from "../../store/noteSendSlice";
import MySendNoteRow from "./MysendNoteRow";
import TriggerRow from "../MySendNote/TriggerRow";

const MySendNote = () => {
    const {t} = useTranslation();
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const sendNoteList = useSelector(
        (state: any) => state.noteSendSlice.sendNoteList
    );
    const totalSendNote = useSelector(
        (state: any) => state.noteSendSlice.totalSendNote
    );
    const totalSendNoteUnread = useSelector(
        (state: any) => state.noteSendSlice.totalSendNoteUnread
    );
    const sendPageIndex = useSelector(
        (state: any) => state.noteSendSlice.sendPageIndex
    );
    const sendPageSize = useSelector(
        (state: any) => state.noteSendSlice.sendPageSize
    );

    const [triggerQueIndex, setTriggerQueIndex] = useState(1)
    const [triggerQueSize, setTriggerQueSize] = useState(10)
    const [triggerQueList, setTriggerQueList] = useState([])
    const [totalTriggerQue, setTotalTriggerQue] = useState([])
    const [tabTriggerType, setTabTriggerType] = useState('QUE')

    useEffect(() => {
        loadAllData();
    }, [sendPageIndex]);

    const loadAllData = () => {
        let params = {
            pageIndex: sendPageIndex,
            pageSize: sendPageSize,
        };
        apiListMyNoteSendOutLog(params).then((res: any) => {
            if (res.code === 0) {
                dispatch(saveSendNoteList(res.data.sendNoteList));
                dispatch(saveTotalSendNote(res.data.totalSendNote));
                dispatch(saveTotalSendNoteUnread(res.data.totalSendNoteUnread));
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
            }
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
                                                    style={{ width: 120}} onClick={() => {
                                                setTabTriggerType('QUE')
                                            }
                                            }>{t('myTrigger.que')}</Button>
                                            <Button type='primary'
                                                    style={{
                                                        width: 120,
                                                        marginLeft: 10
                                                    }}>{t('myTrigger.sendOut')}</Button>
                                        </> : null
                                }
                            </div>
                        </div>
                        {
                            tabTriggerType === 'QUE' ?
                                triggerQueList.length > 0 ?
                                    triggerQueList.map((item, index) => (
                                        <TriggerRow item={item} key={index}/>
                                    ))
                                    : null : null
                        }
                        {sendNoteList.length > 0 ? (
                            <>
                                <div style={{marginTop: 20}}>
                                    {sendNoteList.map((item: any, index: any) => (
                                        <MySendNoteRow item={item} key={index}/>
                                    ))}
                                </div>
                                <Pagination
                                    style={{marginTop: 10, color: themeColor.textLight}}
                                    total={totalSendNote}
                                    current={sendPageIndex}
                                    //   showQuickJumper
                                    showTotal={(total) => `${t("MyNotes.totalNotes")}: ${total}`}
                                    onChange={(page, pz) => {
                                        dispatch(saveSendPageIndex(page));
                                        dispatch(saveSendPageSize(pz));
                                    }}
                                />
                            </>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: 200,
                                    color: themeColor.textLight,
                                    fontSize: 20,
                                }}
                            >
                                {t("common.noData")}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
export default MySendNote;
