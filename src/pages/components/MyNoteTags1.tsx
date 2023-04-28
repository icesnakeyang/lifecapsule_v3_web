import {useEffect} from "react";
import {apiListUserNoteTag} from "../../api/Api";
import {useDispatch, useSelector} from "react-redux";
import {saveEditTags, saveMyAllNoteTags} from "../../store/tagSlice";
import MyAllTagRow from "../MyNotes/MyAllTagRow";
import {useTranslation} from "react-i18next";

const MyNoteTags1 = () => {
    const myAllNoteTags = useSelector((state: any) => state.tagSlice.myAllNoteTags)
    const editTags = useSelector((state: any) => state.tagSlice.editTags)
    const dispatch = useDispatch()
    const {t}=useTranslation()

    useEffect(() => {
        apiListUserNoteTag().then((res: any) => {
            if (res.code === 0) {
                dispatch(saveMyAllNoteTags(res.data.tagList))
            }
        }).catch(() => {
        })
    },[])
    return (
        myAllNoteTags && myAllNoteTags.length > 0 ?
            myAllNoteTags.map((item: any, index: any) => (
                <MyAllTagRow item={item} key={index} onSelectTag={(data: any) => {
                    if (editTags.length === 0) {
                        let tags = [{tagName: data.tagName}]
                        dispatch(saveEditTags(tags))
                    } else {
                        let tags: any = []
                        let cc = 0;
                        editTags.map((item2: any) => {
                            if (data.tagName === item2.tagName) {
                                cc++
                            } else {
                                tags.push(item2)
                            }
                        })
                        if (cc === 0) {
                            tags.push(data)
                            dispatch(saveEditTags(tags))
                        }
                    }
                }}/>
            )) : <div>{t('tag.tipNoMyTag')}</div>
    )
}
export default MyNoteTags1
