import { useEffect, useState } from "react";
import { StatisticsCards } from "../DashboardComponents/StatisticsCards";
import { ClearanceRequestsTable } from "../DashboardComponents/ClearanceRequestsTable";
import { RejectionModal } from "../DashboardComponents/RejectionModal";
import { ClearanceChart } from "../DashboardComponents/ClearanceChart";
import { DashboardHeader } from "../DashboardComponents/DashboardHeader";
import axiosClient from "@/services/axiosBackend";
import { DashboardData } from "@/types/dashboard";
import { ClearanceRequest } from "@/types/dashboard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@mui/material";
import { RefreshCcw } from "lucide-react";
import { MainLayout } from "../../layout/MainLayout";
import RequestsBarChart from "@/pages/Admin/components/DashboardManagment/RequestsBarChart";
import { HandleApproval } from "@/pages/Staff/hooks/handleApproval";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>();
  const [selectedRequest, setSelectedRequest] =
    useState<ClearanceRequest | null>(null);
  // const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/staff/dashboard");
      setDashboardData(response.data);
      console.log("Dashboard data fetched successfully:", response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-8 w-60" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-5 w-full max-w-md" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }
  const handleApprove = async (request: ClearanceRequest, remarks = "") => {
    console.log(request);
    await HandleApproval(request.id, "department_head", "approved", remarks);
  };

  const handleReject = (request: ClearanceRequest) => {
    setSelectedRequest(request);
    setShowRejectionModal(true);
  };

  // const confirmApproval = () => {
  //   console.log(selectedRequest);
  //   if (selectedRequest) {
  //     console.log(`Request ${selectedRequest.id} approved`);
  //   }
  //   setShowApprovalModal(false);
  //   setSelectedRequest(null);
  // };

  const confirmRejection = async (reason: string) => {
    if (!selectedRequest) return;
    if (selectedRequest) {
      console.log(
        `Request ${selectedRequest.id} rejected with reason: ${reason}`
      );
    }
    await HandleApproval(
      selectedRequest.id,
      "department_head",
      "rejected",
      reason
    );

    setShowRejectionModal(false);
    setSelectedRequest(null);
  };

  const statistics = {
    total: dashboardData?.totalRequests ?? 0,
    pending: dashboardData?.pendingRequests ?? 0,
    approved: dashboardData?.apprevedRequests ?? 0,
    rejected: dashboardData?.rejectedRequests ?? 0,
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const chartData = {
    all: dashboardData?.totalRequests ?? 0,
    pending: dashboardData?.pendingRequests ?? 0,
    approved: dashboardData?.apprevedRequests ?? 0,
    rejected: dashboardData?.rejectedRequests ?? 0,
  };
  return (
    <MainLayout>
      <DashboardHeader user={dashboardData?.user} />
      <div className="absolute top-[4.5rem] right-4 mb-6">
        <Button
          className="text-white hover:bg-slate-200"
          onClick={handleRefresh}
          startIcon={<RefreshCcw className="h-6 w-6" />}
        ></Button>
      </div>
      <div className="h-8"></div>
      <StatisticsCards statistics={statistics} />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ClearanceChart statistics={statistics} />
        </div>
        <div className="lg:col-span-2">
          <RequestsBarChart data={chartData} />
        </div>
        <div className="lg:col-span-3">
          <ClearanceRequestsTable
            requests={dashboardData.latestRequests}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
      </div>

      {/* <ApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onConfirm={confirmApproval}
        studentName={selectedRequest?.student.user.name || ""}
      /> */}

      <RejectionModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onConfirm={confirmRejection}
        studentName={selectedRequest?.student.user.name || ""}
      />
    </MainLayout>
  );
};
export default Dashboard;
