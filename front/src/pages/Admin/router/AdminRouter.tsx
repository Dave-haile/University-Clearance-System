import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import UserDetailPage from "../components/UserManagement/UserDetailPage";
import MainLayout from "../components/layout/MainLayout";
import Users from "../pages/Users";
import Requests from "../pages/Requests";
import Departments from "../pages/Departments";
import RequestDetailPage from "../components/ClearanceManagemnt/RequestDetailPage";
import DepartmentDetailPage from "../components/DepartmentManagement/DepartmentDetailPage";
import SettingsPage from "../pages/SettingsPage";
import HelpPage from "../pages/HelpPage";
import CreateUserPage from "../components/UserManagement/CreateUserPage";
import UserReportsPage from "../components/UserManagement/UserReportsPage";
import RequestReportsPage from "../components/ClearanceManagemnt/ClearanceRequestReportPage";
import LogsPage from "../pages/LogsPage";

const AdminRoutes = () => {
  return (
    <>
      {/* <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/Dashbord" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/:id" element={<UserDetailPage />} />
      <Route path="/requests" element={<Requests />} />
      <Route path="/departments" element={<Departments />} />
    </Routes> */}
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/new-user" element={<CreateUserPage />} />
          <Route path="users/:id" element={<UserDetailPage />} />
          <Route path="requests" element={<Requests />} />
          <Route path="requests/:id" element={<RequestDetailPage />} />
          <Route path="departments" element={<Departments />} />
          <Route path="departments/:id" element={<DepartmentDetailPage />} />
          <Route path="logs" element={<LogsPage />} />
          <Route path="/reports/users" element={<UserReportsPage />} />
          <Route path="/reports/requests" element={<RequestReportsPage />} />
          {/* <Route path="/reports/departments" element={<LogsPage />} /> */}
          <Route path="settings" element={<SettingsPage />} />
          <Route path="help" element={<HelpPage />} />
          {/* Placeholder for other routes */}
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default AdminRoutes;
