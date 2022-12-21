import {Tag} from "antd"

const NoteEditTagRow = (data: any) => {
    const {item} = data
    return (<Tag color='blue'>{item.tagName}</Tag>)
}
export default NoteEditTagRow
