import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Requests from "./pages/Requests";
import Departments from "./pages/Departments";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import { AuthProvider } from "../../context/authContext";
import ProtectedRoute from "../../routes/ProtectedRoute";

const queryClient = new QueryClient();

const AdminDash = () => (
  // <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
          {/* <Routes> */}
            {/* Public Routes */}
            {/* <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} /> */}

            {/* Protected Routes */}
            {/* <Route path="/" element={
              <ProtectedRoute allowedRoles={["admin", "manager"]}>
                <Dashboard />
              </ProtectedRoute>
            } /> */}
            {/* <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/requests" element={<Requests />} />
              <Route path="/admin/departments" element={<Departments />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route> */}

            {/* Catch-all route */}
            {/* <Route path="*" element={<NotFound />} /> */}
          {/* </Routes> */}
          <Dashboard />
      </AuthProvider>
    </TooltipProvider>
  // </QueryClientProvider>
);

export default AdminDash;
