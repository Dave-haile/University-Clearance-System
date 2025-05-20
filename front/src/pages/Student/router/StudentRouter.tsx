import { Route, Routes, } from "react-router-dom"
import Dashboard from "../pages/Dashboard"
import SubmitClearance from "../pages/SubmitClearance"

const StudentRouter = () => {
  return (
    <Routes>
        <Route path="/" element={<Dashboard />}  />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/submit-clearance" element={<SubmitClearance/>}/>
        <Route path="/clearance-progress" element={'hello'}/>
        <Route path="/messages" element={<div>message</div>}  />
        <Route path="/profile" element={<div>Profile</div>}  />
    </Routes>
  )
}

export default StudentRouter
