import { Navigate, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import Home from "../pages/Home";
import GuestLayout from "../pages/layout/GuestLayout";
import MainLayout from "../pages/layout/MainLayout";
import { useSelector } from "react-redux";
import NoteList from "../pages/note/NoteList";
import NoteNew from "../pages/note/NoteNew";
import NoteEdit from "../pages/note/NoteEdit";
import ContactList from "../pages/contact/ContactList";
import ContactEdit from "../pages/contact/ContactEdit";
import TriggerPage from "../pages/trigger";
import SelectRecipient from "../pages/recipient/SelectRecipient";
import TriggerDetail from "../pages/trigger/TriggerDetail";
import TodoPage from "../pages/task/todolist/TodoPage";
import TodoEdit from "../pages/task/todolist/TodoEdit";
import CreativeNoteList from "../pages/creativeNote/CreativeNoteList";
import CreativeNoteEdit from "../pages/creativeNote/CreativeNoteEdit";
import QuadrantTaskList from "../pages/task/quadrant/QuadrantTaskList";
import QuadrantTaskEdit from "../pages/task/quadrant/QuadrantTaskEdit";
import QuadrantTaskNew from "../pages/task/quadrant/QuadrantTaskNew";
import ThemeSetting from "../pages/setting/ThemeSetting";
import MyProfilePage from "../pages/myProfile/MyProfilePage";
import SendPage from "../pages/send/SendPage";
import MyReceiveNote from "../pages/send/MyReceiveNote";
import MyReceiveNoteDetail from "../pages/send/MyReceiveNoteDetail";
import MySendNote from "../pages/send/MySendNote";
import MySendNoteDetail from "../pages/send/MySendNoteDetail";
import LoginByEmail from "../pages/login/LoginByEmail";

const ProtectRouter = ({ children }: any) => {
  const token = useSelector((state: any) => state.userDataSlice.token);
  return token ? children : <Navigate to="/" />;
};

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/main" element={<MainLayout />}>
        <Route
          path="/main/dashboard"
          element={
            <ProtectRouter>
              <Dashboard />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/noteList"
          element={
            <ProtectRouter>
              <NoteList />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/noteNew"
          element={
            <ProtectRouter>
              <NoteNew />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/noteEdit"
          element={
            <ProtectRouter>
              <NoteEdit />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/ContactList"
          element={
            <ProtectRouter>
              <ContactList />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/ContactEdit"
          element={
            <ProtectRouter>
              <ContactEdit />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/TriggerPage"
          element={
            <ProtectRouter>
              <TriggerPage />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/SelectRecipient"
          element={
            <ProtectRouter>
              <SelectRecipient />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/TriggerDetail"
          element={
            <ProtectRouter>
              <TriggerDetail />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/TodoPage"
          element={
            <ProtectRouter>
              <TodoPage />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/TodoEdit"
          element={
            <ProtectRouter>
              <TodoEdit />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/CreativeNoteList"
          element={
            <ProtectRouter>
              <CreativeNoteList />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/CreativeNoteEdit"
          element={
            <ProtectRouter>
              <CreativeNoteEdit />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/QuadrantTaskList"
          element={
            <ProtectRouter>
              <QuadrantTaskList />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/QuadrantTaskEdit"
          element={
            <ProtectRouter>
              <QuadrantTaskEdit />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/QuadrantTaskNew"
          element={
            <ProtectRouter>
              <QuadrantTaskNew />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/ThemeSetting"
          element={
            <ProtectRouter>
              <ThemeSetting />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/MyProfilePage"
          element={
            <ProtectRouter>
              <MyProfilePage />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/SendPage"
          element={
            <ProtectRouter>
              <SendPage />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/MyReceiveNote"
          element={
            <ProtectRouter>
              <MyReceiveNote />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/MyReceiveNoteDetail"
          element={
            <ProtectRouter>
              <MyReceiveNoteDetail />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/MySendNote"
          element={
            <ProtectRouter>
              <MySendNote />
            </ProtectRouter>
          }
        />
        <Route
          path="/main/MySendNoteDetail"
          element={
            <ProtectRouter>
              <MySendNoteDetail />
            </ProtectRouter>
          }
        />
      </Route>

      <Route path="/guest" element={<GuestLayout />}>
        <Route path="/guest/LoginByEmail" element={<LoginByEmail />} />
      {/*  <Route path="/guest/register" element={<Register />} />*/}
      </Route>
    </Routes>
  );
};

export default Routers;
