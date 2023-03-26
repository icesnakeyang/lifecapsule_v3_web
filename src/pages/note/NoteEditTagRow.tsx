import {Tag} from "antd"

const NoteEditTagRow = (data: any) => {
    const {item} = data
    console.log(item)
    return (<Tag>{item.tagName}</Tag>)
}
export default NoteEditTagRow
