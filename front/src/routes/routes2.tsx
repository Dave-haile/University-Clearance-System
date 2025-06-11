import { Routes, Route } from "react-router-dom";
import LoginExample from "../components/Login/Example";
import Unauthorized from "../pages/Other/Unauthorized";
import ProtectedRoute from "./ProtectedRoute";
import { DepartmentHead } from "../pages/Staff/Page/DepartmentHead";
import NotFound from "../Moke/NotFound";
import GuestLayout from "../components/Home/GuestLayout";
import ClearanceForm2 from "../components/ClearanceForm/ClearanceForm2";
import AdminRoutes from "../pages/Admin/router/AdminRouter";
import CreateNewCollegeDepartment from "../pages/Admin/components/DepartmentManagement/CreatNewCollegeDepartment";
import LibraryApproval from "../pages/Staff/Page/Library";
import StudentRouter from "@/pages/Student/router/StudentRouter";
// import Toast from "../Moke/toast";

function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginExample />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/" element={<GuestLayout />} />
      <Route path="/about" element={<CreateNewCollegeDepartment />} />

      {/* Protected routes - most specific first */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/*" element={<AdminRoutes />} />
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
      ></Route>
      <Route element={<ProtectedRoute allowedRoles={["department_head"]} />}>
        <Route path="/staff/department_head/*" element={<DepartmentHead />} />
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
        <Route path="/student/*" element={<StudentRouter />} />
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
