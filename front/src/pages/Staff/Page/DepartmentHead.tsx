import { Route, Routes } from "react-router-dom";
import Dashboard from "../component/DepartmentHead/pages/Dashboard";
import Settings from "../component/DepartmentHead/pages/Settings";
import Profile from "../component/DepartmentHead/pages/Profile";
import ClearanceRequests from "../component/DepartmentHead/pages/ClearanceRequests";
import Student from "../component/DepartmentHead/pages/Student";
import UserDetailPage from "@/pages/Admin/components/UserManagement/UserDetailPage";

export const DepartmentHead = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/clearance-requests" element={<ClearanceRequests />} />
        <Route path="/student" element={<Student />} />
        <Route path="/student/:id" element={<UserDetailPage />} />
      </Routes>
    </>
  );
};
