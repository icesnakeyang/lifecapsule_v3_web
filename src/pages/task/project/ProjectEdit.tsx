import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import {Breadcrumb, Button, Card, Col, Form, Input, message, Row} from "antd";
import {useEffect, useState} from "react";
import {apiGetProject, apiSaveMyProject} from "../../../api/Api";

const ProjectEdit = () => {
    const params: any = useLocation().state
    const projectId = params && params.projectId
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor)
    const {t} = useTranslation()
    const navigate = useNavigate()
    const [projectName, setProjectName] = useState('')
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (projectId != null) {
            if (projectId) {
                loadAllData()
            }
        }
    }, [])

    const loadAllData = () => {
        let params = {
            projectId
        }
        apiGetProject(params).then((res: any) => {
            if (res.code === 0) {
                setProjectName(res.data.project.projectName)
            }
        })
    }

    const onSaveProject = () => {
        let params = {
            projectName,
            projectId
        }
        setSaving(true)
        apiSaveMyProject(params).then((res: any) => {
            if (res.code === 0) {
                message.success(t('project.tipSaveSuccess'))
                navigate(-1)
            } else {
                message.error(t('syserr.' + res.code))
                setSaving(false)
            }
        }).catch(() => {
            message.error(t('syserr.10001'))
            setSaving(false)
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
                    title: t('project.myProjectList'),
                    href: '/main/ProjectList'
                },
                {
                    title: t('project.editProject')
                }
            ]}/>
            <Card style={{marginTop: 20}}>
                <Form>
                    <Form.Item>
                        <div>{t('project.projectName')}</div>
                        <Input
                            placeholder={t('project.projectNameHolder')}
                            value={projectName}
                            onChange={e => {
                                setProjectName(e.target.value)
                            }}/>
                    </Form.Item>
                </Form>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {saving ?
                        <Button type='primary' loading>{t('common.btSaving')}</Button> :
                        <Button type='primary' onClick={() => {
                            onSaveProject()
                        }
                        }>{t('project.btSave')}</Button>}
                </div>
            </Card>
            <div style={{color: themeColor.textLight}}>project edit</div>
        </div>

    )
}
export default ProjectEdit
