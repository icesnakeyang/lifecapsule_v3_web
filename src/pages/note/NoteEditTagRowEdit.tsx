import {Tag} from "antd"
import {useDispatch, useSelector} from "react-redux";
import {saveEditTags} from "../../store/tagSlice";

const NoteEditTagRowEdit = (data: any) => {
    const {item} = data
    const editTags = useSelector((state: any) => state.tagSlice.editTags)
    const dispatch = useDispatch()

    const onRemoveTag = () => {
        let tags: any = []
        editTags.forEach((row: any) => {
            if (item.tagName === row.tagName) {
            } else {
                tags.push(row)
            }
        })
        dispatch(saveEditTags(tags))
    }

    return (<Tag closable={true} onClose={(e) => {
        e.preventDefault()
        onRemoveTag()
    }}>{item.tagName}</Tag>)
}
export default NoteEditTagRowEdit
