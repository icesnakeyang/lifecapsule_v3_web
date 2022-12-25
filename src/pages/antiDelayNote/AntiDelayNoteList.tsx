import {Button, Card, message} from "antd"
import {useTranslation} from "react-i18next";
import {apiListMyAntiDelayNote} from "../../api/Api";
import {useEffect, useState} from "react";
import AntiDelayRow from "./AntiDelayRow";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

const AntiDelayNoteList = () => {
    const {t} = useTranslation()
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [noteList, setNoteList] = useState([])
    const [totalNote, setTotalNote] = useState(0)
    const navigate = useNavigate()
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)

    useEffect(() => {
        loadAllData()
    }, [pageIndex])

    const loadAllData = () => {
        let params = {
            pageIndex,
            pageSize
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
        </div>
    )
}
export default AntiDelayNoteList
