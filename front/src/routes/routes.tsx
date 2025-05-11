import { createBrowserRouter } from "react-router-dom";
import Error from "../pages/Other/Error";
import ClearanceForm from "../components/ClearanceForm/ClearanceForm";
import ClearanceForm2 from "../components/ClearanceForm/ClearanceForm2";
import Process from "../components/Home/Process";
// import { LoginParent } from "../Page/BeforLogin";
// import ResetPasswordFlow from "../Page/Parent";
import GuestLayout from "../components/Home/GuestLayout";
import LaravelTestLogin from "../components/Login/LaravelTestLogin";
import StudentRegistration from "../components/Staff/components/StudentAccountCreation";
import Hero from "../components/Home/Hero";
import Features from "../components/Home/Features";
import ClearanceRequest from "../components/ClearanceForm/MokeClearanceRequest";
import SanctumLogin from "../components/Login/sanctumLogin";
import Login from "../components/Login/Login";
// import ResetPasswordFlow from "../Page/Parent";
import LoginExample from "../components/Login/Example";
import StudentUpload from "../components/Staff/components/csvUplaod";
import LibraryApproval from "../components/Staff/Page/Library";
import ClearanceRequestsTable from "../components/Staff/components/ClearanceRequestsTable";
import AdminDashboard from "../pages/Admin/adminDashboard";
import DisplayAllClearance from "../components/Staff/components/DisplayAllClearance";
import CreateStaff from "../pages/Admin/CreateAccount";
import CreateNewCollegeDepartment from "../pages/Admin/CreatNewCollegeDepartment";
import AdminDash from "../pages/Admin/AdminDash";

const route = createBrowserRouter([
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/hero",
        element: <Hero />,
      },
      {
        path: "/feat",
        element: <Features />,
      },
      {
        path: "/process",
        element: <Process />,
      },
    ],
  },
  {
    path: "*",
    errorElement: <Error />,
  },
  {
    path: "/login",
    element: <LoginExample />,
  },
  {
    path: "/about",
    element: <StudentRegistration />,
  },
  {
    path: "/loginMoke",
    element: <SanctumLogin />,
  },

  {
    path: "/StudentForm",
    element: <ClearanceForm />,
  },
  {
    path: "/contact",
    element: <ClearanceForm2 />,
  },
  {
    path: "/dashboard",
    element: "hello",
  },
  {
    path: "/profile",
    element: <StudentUpload />,
  },
  {
    path: "/Student2",
    element: <ClearanceRequest />,
  },
  {
    path: "/approve2",
    element: <ClearanceRequestsTable />,
  },
  {
    path: "/approve",
    element: <LibraryApproval />,
  },
  {
    path: "/approve3",
    element: <DisplayAllClearance />,
  },
  {
    path: "/admin",
    element: <AdminDash />,
  },
  {
    path: "/loginOrignal",
    element: <Login />,
  },
  {
    path: "/forget-password",
    element: <CreateStaff />,
  },
  {
    path: "/loginExample",
    element: <LaravelTestLogin />,
  },
  {
    path: "/createCollege",
    element: <CreateNewCollegeDepartment />,
  },
]);
export default route;
