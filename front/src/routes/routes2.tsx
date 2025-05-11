import { Routes, Route } from "react-router-dom";
import LoginExample from "../components/Login/Example";
import Unauthorized from "../pages/Other/Unauthorized";
import ProtectedRoute from "./ProtectedRoute";
import { DepartmentHead } from "../components/Staff/Page/DepartmentHead";
import NotFound from "../Moke/NotFound";
import GuestLayout from "../components/Home/GuestLayout";
import ClearanceForm2 from "../components/ClearanceForm/ClearanceForm2";
import AdminRoutes from "../pages/Admin/router/AdminRouter";
import CreateStaff from "../pages/Admin/CreateAccount";
import CreateNewCollegeDepartment from "../pages/Admin/CreatNewCollegeDepartment";
import LibraryApproval from "../components/Staff/Page/Library";
// import Toast from "../Moke/toast";

function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginExample />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/" element={<GuestLayout />} />
      <Route path="/about" element={<CreateNewCollegeDepartment/>}/>
      {/* <Route path="/contact" element={<Toast/>}/> */}

      {/* Protected routes - most specific first */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/*" element={<AdminRoutes />} />
      </Route>

      {/* <Route element={<ProtectedRoute allowedRoles={['']}/>}> */}
      <Route path="/contact" element={<ClearanceForm2 />} />
      {/* </Route> */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={[
              "department_head",
              "library",
              "cafeteria",
              "proctor",
              "registrar",
              "admin",
            ]}
          />
        }
      >
        <Route path="/staff" element={<CreateStaff />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["department_head"]} />}>
        <Route path="/staff/department_head" element={<LibraryApproval />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["library"]} />}>
        <Route path="/staff/libarary" element={<LibraryApproval />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["cafeteria"]} />}>
        <Route path="/staff/cafeteria" element={<DepartmentHead />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["proctor"]} />}>
        <Route path="/staff/proctor" element={<DepartmentHead />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["registrar"]} />}>
        <Route path="/staff/registrar" element={<LibraryApproval />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student" element={<ClearanceForm2 />} />
      </Route>

      {/* Index route - protected but comes last */}
      {/* <Route element={<ProtectedRoute allowedRoles={["admin", "department_head", "student","registrar","proctor","cafeteria","library"]} />}>
    </Route> */}

      {/* 404 catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
