import {Button, Form} from "antd";
import {useLocation, useNavigate} from "react-router-dom";

const NoteSendMethod = () => {
    const {noteId}: any = useLocation().state
    const navigate = useNavigate()
    return (
        <Form>
            <Form.Item>
                <Button type='primary' block onClick={() => {
                    navigate('/main/InstantSend', {state: {noteId}})
                }}>直接发送</Button>
            </Form.Item>
            <Form.Item>
                <Button type='primary' block>主倒计时发送</Button>
            </Form.Item>
        </Form>
    )
}
export default NoteSendMethod
