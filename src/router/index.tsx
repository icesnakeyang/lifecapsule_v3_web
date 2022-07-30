import { Navigate, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
import Home from "../pages/Home";
import GuestLayout from "../pages/layout/GuestLayout";
import MainLayout from "../pages/layout/MainLayout";
import Login from "../pages/login/Login";
import Register from "../pages/login/Register";
import { useSelector } from "react-redux";
import NoteList from "../pages/note/NoteList";
import NoteNew from "../pages/note/NoteNew";
import NoteEdit from "../pages/note/NoteEdit";
import NoteCategoryEdit from "../pages/note/NoteCategoryEdit";
import ContactList from "../pages/contact/ContactList";
import ContactEdit from "../pages/contact/ContactEdit";
import SendPage from "../pages/send";
import SelectRecipient from "../pages/send/SelectRecipient";
import SendDetail from "../pages/send/SendDetail";
import TodoPage from "../pages/task/todolist/TodoPage";
import TodoEdit from "../pages/task/todolist/TodoEdit";
import CreativeNoteList from "../pages/creativeNote/CreativeNoteList";
import CreativeNoteEdit from "../pages/creativeNote/CreativeNoteEdit";
import QuadrantTaskList from "../pages/task/quadrant/QuadrantTaskList";
import QuadrantTaskEdit from "../pages/task/quadrant/QuadrantTaskEdit";
import QuadrantTaskNew from "../pages/task/quadrant/QuadrantTaskNew";
import ThemeSetting from "../pages/setting/ThemeSetting";
const ProtectRouter = ({ children }: any) => {
  const token = useSelector((state: any) => state.userDataSlice.token);
  return token ? children : <Navigate to="/guest/login" />;
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
          path="/main/NoteCategoryEdit"
          element={
            <ProtectRouter>
              <NoteCategoryEdit />
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
          path="/main/SendPage"
          element={
            <ProtectRouter>
              <SendPage />
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
          path="/main/SendDetail"
          element={
            <ProtectRouter>
              <SendDetail />
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
      </Route>

      <Route path="/guest" element={<GuestLayout />}>
        <Route path="/guest/login" element={<Login />} />
        <Route path="/guest/register" element={<Register />} />
      </Route>
    </Routes>
  );
};

export default Routers;
