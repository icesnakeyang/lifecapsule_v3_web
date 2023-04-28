import {Tag} from "antd"

const HotTagRow = (data: any) => {
    const {item} = data
    const onSelectTag = () => {
        data.onSelectTag(item)
    }
    return (<a><Tag style={{marginTop:5}} onClick={onSelectTag}>{item.tagName}</Tag></a>)
}
export default HotTagRow
