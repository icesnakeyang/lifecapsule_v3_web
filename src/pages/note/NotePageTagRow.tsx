import {Tag} from "antd"
import {saveNoteListTags} from "../../store/noteDataSlice";
import {useDispatch, useSelector} from "react-redux";
import { loadRefresh } from "../../store/commonSlice";

const NotePageTagRow = (data: any) => {
    const noteListTags = useSelector((state: any) => state.noteDataSlice.noteListTags)
    const dispatch = useDispatch()
    const {item} = data
    const onSelectTag = () => {
    }
    const onRemoveTag = () => {
        let tags: any = []
        if (noteListTags && noteListTags.length > 0) {
            let cc = 0;
            noteListTags.map((item2: any) => {
                if (item2.tagName === item.tagName) {
                    cc++
                } else {
                    tags.push({tagName: item2.tagName})
                }
            })
        }
        dispatch(saveNoteListTags(tags))
        dispatch(loadRefresh())
    }
    return (<Tag closable={true} onClick={onSelectTag} onClose={onRemoveTag} color='blue'>{item.tagName}</Tag>)
}
export default NotePageTagRow
