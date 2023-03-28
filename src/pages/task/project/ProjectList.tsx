import {useSelector} from "react-redux";
import {Breadcrumb, Button, Card, Col, message, Row} from "antd";
import {useTranslation} from "react-i18next";
import {PlusOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {apiListMyProject} from "../../../api/Api";
import {useEffect, useState} from "react";
import {Spin} from "antd/es";
import ProjectRow from "./ProjectRow";

const ProjectList = () => {
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const {t} = useTranslation()
    const navigate = useNavigate()
    const [projectList, setProjectList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadAllData()
    }, [])

    const loadAllData = () => {
        let params = {}
        apiListMyProject(params).then((res: any) => {
            if (res.code === 0) {
                setProjectList(res.data.projectList)
                setLoading(false)
            } else {
                message.error(t('syserr.' + res.code))
            }
        }).catch(() => {
            message.error(t('syserr.10001'))
        })
    }

    return (
        <div>
            <Breadcrumb items={[
                {
                    title: t("common.home"),
                    href: '/main/dashboard'
                },
                {
                    title: t('project.myProjectList')
                }
            ]}/>
            <Card size='small' style={{marginTop: 20}}>
                <Row>
                    <Col>
                        <Button type='primary' icon={<PlusOutlined/>}
                                onClick={() => {
                                    navigate('/main/ProjectEdit')
                                }}
                        >{t('project.createNewProject')}</Button>
                    </Col>
                </Row>

            </Card>
            {loading ?
                <div style={{display: 'flex', justifyContent: 'center', marginTop: 200}}>
                    <Spin size='large'/>
                </div> :
                <div>
                    {projectList.length ?
                        projectList.map((item: any, index: any) => (
                            <ProjectRow item={item}/>
                        )) :
                        <div>no data</div>
                    }
                </div>
            }
        </div>
    )
}
export default ProjectList
