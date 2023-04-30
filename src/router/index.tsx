import {Navigate, Routes, Route} from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import Home from "../pages/Home";
import GuestLayout from "../pages/layout/GuestLayout";
import MainLayout from "../pages/layout/MainLayout";
import {useSelector} from "react-redux";
import NoteList from "../pages/MyNotes/NoteList";
import NoteNew from "../pages/MyNotes/NoteNew";
import NoteEdit from "../pages/MyNotes/NoteEdit";
import ContactList from "../pages/Contact/ContactList";
import ContactEdit from "../pages/Contact/ContactEdit";
import TriggerPage from "../pages/trigger";
import SelectRecipient from "../pages/recipient/SelectRecipient";
import TriggerDetail from "../pages/trigger/TriggerDetail";
import TodoPage from "../pages/TodoList/TodoPage";
import TodoEdit from "../pages/TodoList/TodoEdit";
import QuadrantTaskList from "../pages/task/quadrant/QuadrantTaskList";
import QuadrantTaskEdit from "../pages/task/quadrant/QuadrantTaskEdit";
import QuadrantTaskNew from "../pages/task/quadrant/QuadrantTaskNew";
import ThemeSetting from "../pages/setting/ThemeSetting";
import MyProfilePage from "../pages/MyProfile/MyProfilePage";
import Testpage from "../pages/testpage";
import UserPrivacy from "../pages/UserPrivacy";
import TodoNew from "../pages/TodoList/TodoNew";
import NoteSendList from "../pages/MySendNote/NoteSendList";
import MyTriggerEdit from "../pages/MySendNote/MyTriggerEdit";
import LoginPage from "../pages/login/LoginPage";
import SetLoginName from "../pages/login/SetLoginName";
import AntiDelayNoteList from "../pages/AntiProcrastination/AntiDelayNoteList";
import AntiDelayNoteEdit from "../pages/AntiProcrastination/AntiDelayNoteEdit";
import AntiDelayNoteNew from "../pages/AntiProcrastination/AntiDelayNoteNew";
import PublicNoteByMail from "../pages/publicUserBox/PublicNoteByMail";
import MyReceiveNote from "../pages/MyReceiveNote/MyReceiveNote";
import MyReceiveNoteDetail from "../pages/MyReceiveNote/MyReceiveNoteDetail";
import PublicNoteList from "../pages/MyPublicNote/PublicNoteList";
import PublicNoteEdit from "../pages/MyPublicNote/PublicNoteEdit";
import ProjectList from "../pages/task/project/ProjectList";
import ProjectEdit from "../pages/task/project/ProjectEdit";
import SendPage from "../pages/MyNotes/Send/SendPage";
import InstantSend from "../pages/MyNotes/Send/InstantSend";
import DatetimeSend from "../pages/MyNotes/Send/DatetimeSend";
import PrimarySend from "../pages/MyNotes/Send/PrimarySend";
import PublishToTopic from "../pages/MyNotes/Send/PublishToTopic";
import PublishToMotto from "../pages/MyNotes/Send/PublishToMotto";
import PublishToPublicWeb from "../pages/MyNotes/Send/PublishToPublicWeb";
import PublicArticle from "../pages/publicUserBox/PublicArticle";
import MySendNote from "../pages/MySendNote/MySendNote";
import MySendNoteDetail from "../pages/MySendNote/MySendNoteDetail";
import BindEmail from "../pages/MyProfile/BindEmail";

const ProtectRouter = ({children}: any) => {
    const token = useSelector((state: any) => state.userDataSlice.token);
    return token ? children : <Navigate to="/"/>;
};

const Routers = () => {
    return (
        <Routes>
            <Route path="/test" element={<Testpage/>}/>
            <Route path="/user_privacy" element={<UserPrivacy/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/main" element={<MainLayout/>}>
                <Route
                    path="/main/dashboard"
                    element={
                        <ProtectRouter>
                            <Dashboard/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/noteList"
                    element={
                        <ProtectRouter>
                            <NoteList/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/noteNew"
                    element={
                        <ProtectRouter>
                            <NoteNew/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/noteEdit"
                    element={
                        <ProtectRouter>
                            <NoteEdit/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/ContactList"
                    element={
                        <ProtectRouter>
                            <ContactList/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/ContactEdit"
                    element={
                        <ProtectRouter>
                            <ContactEdit/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/TriggerPage"
                    element={
                        <ProtectRouter>
                            <TriggerPage/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/SelectRecipient"
                    element={
                        <ProtectRouter>
                            <SelectRecipient/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/TriggerDetail"
                    element={
                        <ProtectRouter>
                            <TriggerDetail/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/TodoPage"
                    element={
                        <ProtectRouter>
                            <TodoPage/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/TodoEdit"
                    element={
                        <ProtectRouter>
                            <TodoEdit/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/QuadrantTaskList"
                    element={
                        <ProtectRouter>
                            <QuadrantTaskList/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/QuadrantTaskEdit"
                    element={
                        <ProtectRouter>
                            <QuadrantTaskEdit/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/QuadrantTaskNew"
                    element={
                        <ProtectRouter>
                            <QuadrantTaskNew/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/ThemeSetting"
                    element={
                        <ProtectRouter>
                            <ThemeSetting/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/MyProfilePage"
                    element={
                        <ProtectRouter>
                            <MyProfilePage/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/SendPage"
                    element={
                        <ProtectRouter>
                            <SendPage/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/MyReceiveNote"
                    element={
                        <ProtectRouter>
                            <MyReceiveNote/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/MyReceiveNoteDetail"
                    element={
                        <ProtectRouter>
                            <MyReceiveNoteDetail/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/MySendNote"
                    element={
                        <ProtectRouter>
                            <MySendNote/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/MySendNoteDetail"
                    element={
                        <ProtectRouter>
                            <MySendNoteDetail/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/TodoNew"
                    element={
                        <ProtectRouter>
                            <TodoNew/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/InstantSend"
                    element={
                        <ProtectRouter>
                            <InstantSend/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/PrimarySend"
                    element={
                        <ProtectRouter>
                            <PrimarySend/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/DatetimeSend"
                    element={
                        <ProtectRouter>
                            <DatetimeSend/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/NoteSendList"
                    element={
                        <ProtectRouter>
                            <NoteSendList/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/MyTriggerEdit"
                    element={
                        <ProtectRouter>
                            <MyTriggerEdit/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/SetLoginName"
                    element={
                        <ProtectRouter>
                            <SetLoginName/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/AntiDelayNoteList"
                    element={
                        <ProtectRouter>
                            <AntiDelayNoteList/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/AntiDelayNoteEdit"
                    element={
                        <ProtectRouter>
                            <AntiDelayNoteEdit/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/AntiDelayNoteNew"
                    element={
                        <ProtectRouter>
                            <AntiDelayNoteNew/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/PublishToPublicWeb"
                    element={
                        <ProtectRouter>
                            <PublishToPublicWeb/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/PublicNoteList"
                    element={
                        <ProtectRouter>
                            <PublicNoteList/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/PublicNoteEdit"
                    element={
                        <ProtectRouter>
                            <PublicNoteEdit/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/ProjectList"
                    element={
                        <ProtectRouter>
                            <ProjectList/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/ProjectEdit"
                    element={
                        <ProtectRouter>
                            <ProjectEdit/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/PublishToTopic"
                    element={
                        <ProtectRouter>
                            <PublishToTopic/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/PublishToMotto"
                    element={
                        <ProtectRouter>
                            <PublishToMotto/>
                        </ProtectRouter>
                    }
                />
                <Route
                    path="/main/BindEmail"
                    element={
                        <ProtectRouter>
                            <BindEmail/>
                        </ProtectRouter>
                    }
                />
            </Route>

            <Route path="/guest" element={<GuestLayout/>}>
                {/*<Route path="/guest/LoginByEmail" element={<LoginByEmail/>}/>*/}
                <Route path="/guest/LoginPage" element={<LoginPage/>}/>
                {/*  <Route path="/guest/register" element={<Register />} />*/}
            </Route>
            <Route path="/publicMail/:logId" element={<PublicNoteByMail/>}></Route>
            <Route path="/PublicArticle/:articleId" element={<PublicArticle/>}></Route>
        </Routes>
    );
};

export default Routers;
