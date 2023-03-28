import {Button, Card, Col, Row, Tag} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {saveCurrentProjectId, saveCurrentProjectName} from "../../../store/projectSlice";
import {saveDoNotLoadToDoTask} from "../../../store/commonSlice";

const ProjectRow = (data: any) => {
    const {item} = data
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    return (
        <Card size='small' style={{marginTop: 10, background: themeColor.blockDark}}>
            <Row>
                <Col span={12}>
                    {item.projectName}
                </Col>
                <Col span={12}>
                    <Button type='primary' size='small' onClick={() => {
                        dispatch(saveCurrentProjectId(item.projectId))
                        dispatch(saveCurrentProjectName(item.projectName))
                        navigate(-1)
                    }}>Select</Button>
                    <Button style={{marginLeft: 10}} color={themeColor.color1} size='small' onClick={() => {
                        navigate('/main/ProjectEdit', {state: {projectId: item.projectId}})
                    }}>detail</Button>
                </Col>
            </Row>
        </Card>
    )
}
export default ProjectRow
