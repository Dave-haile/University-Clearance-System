import { Navigate, Route, Routes } from "react-router-dom"
import ClearanceHistory from "../pages/ClearanceHistory"
import Profile from "../pages/Profile"
import StudentDashboard from "../pages/StudentDashboard"
import StudentLayout from "../components/layout/MainLayout"
import StudentClearanceRequest from "../pages/SubmitClearance"
import HelpPage from "@/pages/Admin/pages/HelpPage"

const StudentRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="dashboard" replace />} />
      <Route path="/" element={<StudentLayout />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/submit-clearance" element={<StudentClearanceRequest />} />
        <Route path="/clearance-history" element={<ClearanceHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="*" element={<StudentDashboard />} />
      </Route>
    </Routes>
  )
}

export default StudentRouter
