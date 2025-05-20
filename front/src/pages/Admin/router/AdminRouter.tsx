import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";
import Users from "../pages/Users";
import Requests from "../pages/Requests";
import Departments from "../pages/Departments";
import UserDetailPage from "../components/UserManagement/UserDetailPage";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/Dashbord" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/:id" element={<UserDetailPage />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/departments" element={<Departments />} />
    </Routes>
  );
};

export default AdminRoutes;
