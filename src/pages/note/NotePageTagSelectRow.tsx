import {Tag} from "antd"

const NotePageTagSelectRow = (data: any) => {
    const {item} = data
    return (<Tag closable={true} onClose={() => {
    }}>
        {item.tagName}
    </Tag>)
}
export default NotePageTagSelectRow
