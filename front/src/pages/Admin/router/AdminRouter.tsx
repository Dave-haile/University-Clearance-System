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
      <Route path="admin" element={<Dashboard />} />
      <Route path="admin/Dashbord" element={<Dashboard />} />
      <Route path="admin/settings" element={<Settings />} />
      <Route path="admin/users" element={<Users />} />
      <Route path="/admin/users/:id" element={<UserDetailPage />} />
      <Route path="admin/requests" element={<Requests />} />
      <Route path="admin/departments" element={<Departments />} />
    </Routes>
  );
};

export default AdminRoutes;
