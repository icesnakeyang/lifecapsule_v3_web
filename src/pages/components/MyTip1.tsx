import {useSelector} from "react-redux";
import React, {useState} from "react";
import {CaretDownOutlined, CaretUpOutlined, InfoCircleOutlined} from "@ant-design/icons";

interface Props {
    title: String,
    msgList: []
}

const MyTip1: React.FC<Props> = ({title, msgList}) => {
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const [showTip, setShowTip] = useState(false)
    return (
        <div style={{background: themeColor.blockDark, borderRadius: 5, padding: 10, color: themeColor.textHolder}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <InfoCircleOutlined style={{fontSize: 24, color: themeColor.colorDanger2}}/>
                <div style={{marginLeft: 10, fontSize: 16}}>{title}</div>
                {!showTip ?
                    <a onClick={() => {
                        setShowTip(true)
                    }}><CaretDownOutlined
                        style={{
                            fontSize: 20, display: 'flex', alignItems: 'center',
                            color: themeColor.colorDanger2,
                            marginLeft: 10
                        }}/></a>

                    : <a onClick={() => {
                        setShowTip(false)
                    }}><CaretUpOutlined
                        style={{
                            fontSize: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: themeColor.colorDanger2,
                            marginLeft: 10
                        }}/></a>
                }
            </div>
            {
                showTip ?
                    <div style={{
                        margin: 10
                    }}>
                        {msgList && msgList.length > 0 ?
                            msgList.map((item, index) => (
                                <p>{item}</p>
                            ))
                            : null}
                    </div>
                    : null
            }
        </div>
    )
}
export default MyTip1
