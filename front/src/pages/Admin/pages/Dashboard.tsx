import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { RefreshCcw } from "lucide-react";
import axiosClient from "../../../services/axiosBackend";
import { DashboardData } from "../../../types/dashboard";
import { Button } from "../components/ui/button";
import SummaryCard from "../components/DashboardManagment/SummaryCard";
import RequestsBarChart from "../components/DashboardManagment/RequestsBarChart";
import DepartmentPieChart from "../components/DashboardManagment/DepartmentPieChart";
import MonthlyTrendsChart from "../components/DashboardManagment/MonthlyTrendsChart";
import StaffRolesCard from "../components/DashboardManagment/StaffRolesCard";
import { notifyError, notifySuccess } from "../../../hooks/toast";
import RecentRequestsTable from "../components/DashboardManagment/RecentRequestsTable";

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  // const location = useLocation();
  // const message = location.state?.message; 

  // useEffect(() => {
  //   if (message) {
  //     console.log("Message from location state:", message);
  //     notifySuccess(message); 
  //   }
  // }, [message]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/admin/dashboard");
      setData(response.data);
      setLoading(false);
      notifySuccess("Data is Fetched Successfully");
    } catch (error) {
      notifyError(`Error fetching dashboard data: ${error}`);
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-9xl mx-auto px-1 sm:px-2 lg:px-4 py-2">
          <div className="flex justify-between">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Academic Clearance Dashboard
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Overview of all clearance requests and statistics
              </p>
            </header>
            <Button
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
            >
              <RefreshCcw className="h-4 w-4" /> Refresh
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            <SummaryCard
              title="Total Users"
              value={data?.total_users ?? 0}
              type="users"
              isloading={loading}
            />
            <SummaryCard
              title="Total Students"
              value={data?.total_students}
              type="students"
              isloading={loading}
            />
            <SummaryCard
              title="Total Staff"
              value={data?.total_staff}
              type="staff"
              isloading={loading}
            />
            <SummaryCard
              title="Total Departments"
              value={data?.total_departments}
              type="departments"
              isloading={loading}
            />
            <SummaryCard
              title="Total Colleges"
              value={data?.total_colleges}
              type="colleges"
              isloading={loading}
            />
            <SummaryCard
              title="Total Requests"
              value={data?.totals.all ?? 0}
              type="total"
              isloading={loading}
            />
            <SummaryCard
              title="Approved Requests"
              value={data?.totals.approved ?? 0}
              type="approved"
              isloading={loading}
            />
            <SummaryCard
              title="Pending Requests"
              value={data?.totals.pending ?? 0}
              type="pending"
              isloading={loading}
            />
            <SummaryCard
              title="Rejected Requests"
              value={data?.totals.rejected ?? 0}
              type="rejected"
              isloading={loading}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <RequestsBarChart data={data?.totals} />
            <DepartmentPieChart data={data?.byDepartment} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <StaffRolesCard roles={data?.staffRoles} />
            <MonthlyTrendsChart data={data?.byMonth} />
          </div>
          <div>
            <MonthlyTrendsChart data={data?.byMonth} />
          </div>
          <div className="mt-10">
            <RecentRequestsTable requests={data?.recentRequests} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
