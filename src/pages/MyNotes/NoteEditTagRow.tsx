import {Tag} from "antd"

const NoteEditTagRow = (data: any) => {
    const {item} = data
    return (<Tag>{item.tagName}</Tag>)
}
export default NoteEditTagRow
