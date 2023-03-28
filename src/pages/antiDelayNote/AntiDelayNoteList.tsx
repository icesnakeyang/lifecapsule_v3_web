import {Breadcrumb, Button, Card, message, Pagination} from "antd"
import {useTranslation} from "react-i18next";
import {apiListMyAntiDelayNote} from "../../api/Api";
import {useEffect, useState} from "react";
import AntiDelayRow from "./AntiDelayRow";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {saveAntiDelayNotePageIndex, saveAntiDelayNotePageSize} from "../../store/antiDelaySlice";

const AntiDelayNoteList = () => {
    const {t} = useTranslation()
    const antiDelayNotePageIndex=useSelector((state:any)=>state.antiDelaySlice.antiDelayNotePageIndex)||1
    const antiDelayNotePageSize=useSelector((state:any)=>state.antiDelaySlice.antiDelayNotePageSize)||10
    const [noteList, setNoteList] = useState([])
    const [totalNote, setTotalNote] = useState(0)
    const navigate = useNavigate()
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const dispatch=useDispatch()

    useEffect(() => {
        loadAllData()
    }, [antiDelayNotePageIndex,antiDelayNotePageSize])

    const loadAllData = () => {
        let params = {
            pageIndex:antiDelayNotePageIndex,
            pageSize:antiDelayNotePageSize
        }
        apiListMyAntiDelayNote(params).then((res: any) => {
            if (res.code === 0) {
                setNoteList(res.data.noteList)
                setTotalNote(res.data.totalNote)
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
                    title: t("antiDelayNote.antiDelayNoteList"),
                    href: '/main/AntiDelayNoteList'
                }
            ]}/>
            <Card style={{background: themeColor.blockDark}}>
                <Button type='primary' onClick={() => {
                    navigate("/main/AntiDelayNoteNew")
                }}>{t('antiDelayNote.btAddNew')}</Button>
            </Card>
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
                showTotal={(total) => `${t("note.totalNotes")}: ${total}`}
                onChange={(page, pz) => {
                    dispatch(saveAntiDelayNotePageIndex(page));
                    dispatch(saveAntiDelayNotePageSize(pz));
                }}
            />
        </div>
    )
}
export default AntiDelayNoteList
