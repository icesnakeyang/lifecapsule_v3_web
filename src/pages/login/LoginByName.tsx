import {Input} from "antd";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {saveUserEmail} from "../../store/userDataSlice";

const LoginByName = () => {
    const email = useSelector((state: any) => state.userDataSlice.email)
    const dispatch = useDispatch()
    const [ee, setEE] = useState('')
    return (
        <div>
            <Input value={email} onChange={(e) => {
                dispatch(saveUserEmail(e.target.value))
            }}/>
            <Input value={ee} onChange={(e) => {
                setEE(e.target.value)
            }}/>
        </div>
    )
}
export default LoginByName
