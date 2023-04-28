import {
    Breadcrumb,
    Button,
    Card,
    Checkbox,
    Col,
    List,
    message,
    Pagination,
    Row, Tag,
} from "antd";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {apiListMyTaskTodo} from "../../api/Api";
import {
    saveTodoList,
    saveTodoPageIndex,
    saveTodoPageSize,
    saveTotalTodo,
} from "../../store/taskTodoSlice";
import {useNavigate} from "react-router-dom";
import TodoRow from "./TodoRow";
import {Spin} from "antd/es";
import {FolderOutlined, PlusOutlined} from "@ant-design/icons";
import {clearCurrentProject} from "../../store/projectSlice";
import {saveDoNotLoadToDoTask} from "../../store/commonSlice";

const TodoPage = () => {
    const [loadMore, setLoadMore] = useState(false);
    const dispatch = useDispatch();
    const todoList = useSelector((state: any) => state.taskTodoSlice.todoList);
    const totalTodo = useSelector((state: any) => state.taskTodoSlice.totalTodo);
    const {t} = useTranslation();
    const navigate = useNavigate();
    const refresh = useSelector((state: any) => state.commonSlice.refresh);
    const themeColor = useSelector((state: any) => state.themeSlice.themeColor);
    const todoPageIndex = useSelector(
        (state: any) => state.taskTodoSlice.todoPageIndex || 1
    );
    const todoPageSize = useSelector(
        (state: any) => state.taskTodoSlice.todoPageSize || 10
    );
    const [hideComplete, setHideComplete] = useState(false);
    const [loading, setLoading] = useState(true)
    const currentProjectName = useSelector((state: any) => state.projectSlice.currentProjectName)
    const currentProjectId = useSelector((state: any) => state.projectSlice.currentProjectId)
    const doNotLoadTodoTask = useSelector((state: any) => state.commonSlice.doNotLoadTodoTask)

    useEffect(() => {
        console.log('effect 1')
        loadAllData();
        return () => {
        };
    }, [todoPageIndex, refresh, hideComplete, currentProjectId]);

    useEffect(() => {
        console.log('effect 2')
        if (doNotLoadTodoTask) {
            dispatch(saveDoNotLoadToDoTask(false))
        } else {
            console.log('set page to 1')
            dispatch(saveTodoPageIndex(1))
        }
        // loadAllData()
    }, [])

    const loadAllData = () => {
        let params = {
            pageIndex: todoPageIndex,
            pageSize: todoPageSize,
            hideComplete,
            projectId: currentProjectId
        };
        setLoading(true)
        apiListMyTaskTodo(params)
            .then((res: any) => {
                if (res.code === 0) {
                    if (loadMore) {
                        dispatch(saveTodoList(todoList.concat(res.data.taskTodoList)));
                    } else {
                        dispatch(saveTodoList(res.data.taskTodoList));
                    }
                    dispatch(saveTotalTodo(res.data.totalTaskTodo));
                    let psize=res.data.totalTaskTodo/todoPageSize
                    let pmod=res.data.totalTaskTodo%todoPageSize
                    if(todoPageIndex>psize){
                        if(pmod===0){
                            dispatch(saveTodoPageIndex(psize))
                        }
                    }
                    setLoadMore(false);
                    setLoading(false)
                } else {
                    message.error(t("syserr." + res.code));
                    if (res.code === 10047) {
                        navigate("/guest/LoginPage");
                    }
                }
            })
            .catch(() => {
                message.error(t("syserr.10001"));
            });
    };

    const _renderNote = (item: any) => {
        return (
            <List.Item
                style={{background: "#fff"}}
                actions={[
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                            navigate("/main/TodoEdit", {state: {taskId: item.taskId}});
                        }}
                    >
                        {t("common.btDetail")}
                    </Button>,
                ]}
            >
                {item.complete}
                {item.complete}
                {item.complete ? (
                    <div style={{}}>{item.title}完成</div>
                ) : (
                    <div>{item.title}未完成</div>
                )}
                {/* <List.Item.Meta title={item.title} description="" /> */}
            </List.Item>
        );
    };

    const onComplete = () => {
        setHideComplete(!hideComplete);
    };

    return (
        <div>
            <Breadcrumb style={{}} items={[
                {
                    title: t("common.home"),
                    href: '/main/dashboard'
                },
                {
                    title: t("task.myTodoList"),
                }
            ]}>
            </Breadcrumb>

            <Card size='small' style={{background: themeColor.blockDark}}>
                <Row gutter={[16, 8]}>
                    <Col xs={12} sm={12} md={12} lg={5} xl={4} xxl={3}>
                        <Button
                            type="primary"
                            onClick={() => {
                                navigate("/main/TodoNew");
                            }}
                            icon={<PlusOutlined/>}
                        >
                            {t("task.btAddTodo")}
                        </Button>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={5} xl={4} xxl={3} style={{display: "flex", alignItems: "center"}}>
                        <Checkbox
                            style={{color: themeColor.textLight}}
                            onChange={onComplete}
                        >
                            {t("task.hideComplete")}
                        </Checkbox>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={14} xl={16} xxl={18} style={{display: 'flex', alignItems: 'center'}}>
                        <Button type='primary' icon={<FolderOutlined/>}
                                onClick={() => {
                                    navigate("/main/ProjectList")
                                }}
                        >{t('project.currentProject')}</Button>
                        {currentProjectName &&
                            <div style={{marginLeft: 10}}>
                                <Tag closable onClose={() => {
                                    dispatch(clearCurrentProject())
                                }}>{currentProjectName}</Tag>
                            </div>
                        }
                    </Col>
                </Row>
            </Card>

            {loading ?
                <div style={{marginTop: 200, display: 'flex', justifyContent: 'center'}}>
                    <Spin size='large'/>
                </div> :
                <div style={{marginTop: 10}}>
                    {todoList.map((item: any, index: number) => {
                        return <TodoRow item={item} key={index}/>;
                    })}
                    <Pagination
                        style={{marginTop: 10, color: themeColor.textLight}}
                        total={totalTodo}
                        current={todoPageIndex}
                        showQuickJumper
                        showTotal={(total) => `${t("MyNotes.totalNotes")}: ${total}`}
                        onChange={(page, pz) => {
                            dispatch(saveTodoPageIndex(page));
                            dispatch(saveTodoPageSize(pz));
                        }}
                    />
                </div>
            }
        </div>
    );
};

export default TodoPage;
