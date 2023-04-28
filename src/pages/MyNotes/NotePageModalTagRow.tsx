import {Tag} from "antd"
import {useDispatch, useSelector} from "react-redux";
import {saveNoteListTags} from "../../store/noteDataSlice";
import {loadRefresh} from "../../store/commonSlice";

const NotePageModalTagRow = (data: any) => {
    const {item} = data
    const noteListTags = useSelector((state: any) => state.noteDataSlice.noteListTags)
    const dispatch = useDispatch()

    const onSelectTag = () => {
        let tags = []
        if (noteListTags && noteListTags.length > 0) {
            let cc = 0;
            noteListTags.map((item2: any) => {
                if (item2.tagName === item.tagName) {
                    cc++
                }
                tags.push({tagName: item2.tagName})
            })
            if (cc === 0) {
                tags.push({tagName: item.tagName})
            }
        } else {
            tags.push({tagName: item.tagName})
        }
        dispatch(saveNoteListTags(tags))
        dispatch(loadRefresh())
        data.getFun()
    }
    return (<a><Tag onClick={onSelectTag}>{item.tagName}</Tag></a>)
}
export default NotePageModalTagRow
