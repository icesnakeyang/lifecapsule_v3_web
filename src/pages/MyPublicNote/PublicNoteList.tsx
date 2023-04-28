import {useSelector} from "react-redux";
import {Breadcrumb, Card, message, Spin} from "antd";
import {useEffect, useState} from "react";
import {apiListMyPublicNote} from "../../api/Api";
import {useTranslation} from "react-i18next";
import PublicNoteRow from "./PublicNoteRow";

const PublicNoteList = () => {
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [noteList, setNoteList] = useState([])
    const {t} = useTranslation()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadAllData()
    }, [pageIndex, pageSize])

    const loadAllData = () => {
        let params = {
            pageIndex,
            pageSize
        }
        setLoading(true)
        apiListMyPublicNote(params).then((res: any) => {
            if (res.code === 0) {
                setNoteList(res.data.noteList)
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
                    title: t('common.home'),
                    href: '/main/dashboard'
                },
                {
                    title: t("nav.myPublicNote")
                }
            ]}/>

            <div style={{marginTop:0}}>
                {loading ?
                    <Spin size='large'/>
                    :
                    noteList.map((item, index) => (
                        <PublicNoteRow item={item} key={index}/>
                    ))
                }
            </div>

        </div>
    )
}
export default PublicNoteList
