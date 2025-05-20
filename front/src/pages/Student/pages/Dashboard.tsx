import React, { useEffect, useState } from "react";
import WelcomeCard from "../components/DashboardboardManagment/WelcomeCard";
import ClearanceStatusCard from "../components/DashboardboardManagment/ClearanceStatusCard";
import ProgressTracker from "../components/DashboardboardManagment/ProgressTracker";
import RecentMessages from "../components/DashboardboardManagment/RecentMessages";
import QuickActions from "../components/DashboardboardManagment/QuickActions";
import { MainLayout } from "../components/layout/MainLayout";
import axiosClient from "@/services/axiosBackend";
// import { Button } from "@mui/material";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/student";
import { toast } from "sonner";
import { FileUp, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import {
  CardDescription,
  CardTitle,
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setloading] = useState(false);

  const getData = async () => {
    setloading(true)
    try {
      const response = await axiosClient.get("/student/data");
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
      ) {
        console.log(error.response.data.message || "Error fetching data");
        toast.error("Error fetching data");
      } else {
        console.log("Error fetching data");
        toast("Error fetching data");
      }
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    getData();
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

  return (
    <MainLayout>
      <div className="flex justify-end">
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700" onClick={getData}>
          <RefreshCcw className="h-4 w-4" /> Refresh
        </Button>
      </div>
      <div className="space-y-6">
        {data.length > 0 && (
          <>
            <WelcomeCard student={data} />

            {data[0].student.clearance_requests !== null ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <ClearanceStatusCard
                    approvals={
                      data[0].student.clearance_requests?.approvals || {}
                    }
                    status={
                      data[0].student.clearance_requests?.status || "pending"
                    }
                  />
                </div>
                <div className="lg:col-span-2">
                  <ProgressTracker
                    approvals={
                      data[0].student.clearance_requests?.approvals || {}
                    }
                    status={"approved"}
                  />
                </div>
              </div>
            ) : (
              <Card className="h-full">
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Clearance Status
                  </h2>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-gray-100 rounded-full p-4 mb-4">
                    <FileUp size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    No Clearance Request Found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Submit a clearance request to see its details and track
                    progress
                  </p>
                  <Link
                    to={"/student/submit-clearance"}
                    className="bg-blue-800 hover:bg-blue-900 text-white shadow-sm inline-flex items-center justify-center font-medium transition-colors
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm rounded-lg"
                  >
                    Request Clearance
                  </Link>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentMessages />
          <QuickActions />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
