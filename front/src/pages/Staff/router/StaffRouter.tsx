import { Navigate, Route, Routes } from "react-router-dom";
import StaffLayout from "../component/layout/MainLayout";
import StaffDashboard from "../Page/StaffDashboard";
import StaffRequestsPage from "../Page/StaffRequestsPage";
import StaffRequestDetailPage from "../Page/StaffRequestDetailPage";
import StaffDepartmentPage from "../Page/StaffDepartmentPage";
import HelpPage from "@/pages/Admin/pages/HelpPage";

const StaffRouter = () => {
  return (
    <Routes>
      <Route element={<StaffLayout />}>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="requests" element={<StaffRequestsPage />} />
        <Route path="requests/:id" element={<StaffRequestDetailPage />} />
        <Route path="department" element={<StaffDepartmentPage />} />
        <Route path="help" element={<HelpPage />} />

        <Route path="department_head/*" element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="library/*" element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="library_staff/*" element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="cafeteria/*" element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="proctor/*" element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="registrar/*" element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/staff/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default StaffRouter;
