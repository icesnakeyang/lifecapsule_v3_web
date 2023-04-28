import {Breadcrumb, Button, Card, message, Pagination} from "antd"
import {useTranslation} from "react-i18next";
import {apiListMyAntiDelayNote} from "../../api/Api";
import {useEffect, useState} from "react";
import AntiDelayRow from "./AntiDelayRow";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {saveAntiDelayNotePageIndex, saveAntiDelayNotePageSize} from "../../store/antiDelaySlice";
import {Spin} from "antd/es";

const AntiDelayNoteList = () => {
    const {t} = useTranslation()
    const antiDelayNotePageIndex = useSelector((state: any) => state.antiDelaySlice.antiDelayNotePageIndex) || 1
    const antiDelayNotePageSize = useSelector((state: any) => state.antiDelaySlice.antiDelayNotePageSize) || 10
    const [noteList, setNoteList] = useState([])
    const [totalNote, setTotalNote] = useState(0)
    const navigate = useNavigate()
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadAllData()
    }, [antiDelayNotePageIndex, antiDelayNotePageSize])

    const loadAllData = () => {
        let params = {
            pageIndex: antiDelayNotePageIndex,
            pageSize: antiDelayNotePageSize
        }
        setLoading(true)
        apiListMyAntiDelayNote(params).then((res: any) => {
            if (res.code === 0) {
                setNoteList(res.data.noteList)
                setTotalNote(res.data.totalNote)
                setLoading(false)
            } else {
                message.error(t('syserr.' + res.code))
            }
        }).catch(() => {
            message.error(t('syserr.10001'))
        })
    }
    return (
        <div>
            <Breadcrumb style={{margin: "20px 0"}} items={[
                {
                    title: t("common.home"),
                    href: '/main/dashboard'
                },
                {
                    title: t("AntiProcrastination.antiDelayNoteList"),
                    href: '/main/AntiDelayNoteList'
                }
            ]}/>
            {loading ?
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 100}}>
                    <Spin size='large'/>
                </div>
                :
                <>
                    <Card style={{background: themeColor.blockDark}}>
                        <Button type='primary' onClick={() => {
                            navigate("/main/AntiDelayNoteNew")
                        }}>{t('AntiProcrastination.btAddNew')}</Button>
                    </Card>
                    {
                        noteList.length > 0 ?
                            <>
                                {
                                    noteList.map((item, index) => (
                                        <AntiDelayRow item={item} key={index}/>
                                    ))
                                }
                                <Pagination
                                    style={{marginTop: 10, color: themeColor.textLight}}
                                    total={totalNote}
                                    current={antiDelayNotePageIndex}
                                    defaultPageSize={antiDelayNotePageSize}
                                    showQuickJumper
                                    showTotal={(total) => `${t("MyNotes.totalNotes")}: ${total}`}
                                    onChange={(page, pz) => {
                                        dispatch(saveAntiDelayNotePageIndex(page));
                                        dispatch(saveAntiDelayNotePageSize(pz));
                                    }}
                                />
                            </>
                            :
                            <div style={{
                                color: themeColor.textLight,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 100
                            }}>
                                <div>
                                    {t('AntiProcrastination.tipNoAntiDelayNote')}
                                </div>
                                <div style={{marginTop: 20}}>
                                    <Button type='primary' onClick={() => {
                                        navigate("/main/AntiDelayNoteNew")
                                    }
                                    }>{t('AntiProcrastination.startNow')}</Button>
                                </div>
                            </div>
                    }
                </>
            }
        </div>
    )
}
export default AntiDelayNoteList
