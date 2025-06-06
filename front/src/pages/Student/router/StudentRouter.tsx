import { Route, Routes, } from "react-router-dom"
import Dashboard from "../pages/Dashboard"
import SubmitClearance from "../pages/SubmitClearance"
import ClearanceHistory from "../pages/ClearanceHistory"
import Profile from "../pages/Profile"

const StudentRouter = () => {
  return (
    <Routes>
        <Route path="/" element={<Dashboard />}  />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/submit-clearance" element={<SubmitClearance/>}/>
        <Route path="/clearance-history" element={<ClearanceHistory/>}/>
        <Route path="/profile" element={<Profile/>}  />
    </Routes>
  )
}

export default StudentRouter
