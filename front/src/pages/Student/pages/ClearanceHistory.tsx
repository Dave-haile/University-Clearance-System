import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import StatusIndicator from "../components/ui/StatusIndicator";
import { formatDistanceToNow } from "date-fns";
import { User } from "@/types/user";
import axiosClient from "@/services/axiosBackend";
import { MainLayout } from "../components/layout/MainLayout";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

const ClearanceHistory: React.FC = () => {
  const [data, setData] = useState<User | null>();
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/student/alldata");
      setData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetch();
  }, []);

  const clearanceRequests = data?.student?.clearance_requests;
  console.log(clearanceRequests);

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
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }
  if (!Array.isArray(clearanceRequests) || clearanceRequests.length === 0) {
    return (
      <MainLayout>
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold text-gray-800">
              Clearance History
            </h2>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500">No clearance history found</p>
            </div>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            Clearance History
          </h2>
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 mb-2"
            onClick={fetch}
          >
            <RefreshCcw className="h-4 w-4" /> Refresh
          </Button>
        </div>

        <div className="grid gap-6">
          {clearanceRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {request.year} - {request.semester} Semester
                    </h3>
                    <p className="text-sm text-gray-500">
                      Submitted{" "}
                      {formatDistanceToNow(new Date(request.created_at))} ago
                    </p>
                  </div>
                  <StatusIndicator
                    status={
                      request.current_step === "all_approved"
                        ? "approved"
                        : request.status === "rejected"
                        ? "rejected"
                        : "pending"
                    }
                    showText
                    size="lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Academic Year</p>
                    <p className="font-medium">{request.academic_year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cafteria Status</p>
                    <p className="font-medium capitalize">
                      {request.cafe_status}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-medium">
                      {request.department.department}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">College</p>
                    <p className="font-medium">{request.department.college}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Section</p>
                    <p className="font-medium">{request.section}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Reason for Clearance
                    </p>
                    <p className="font-medium capitalize">
                      {request.reason_for_clearance.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Step</p>
                    <p className="font-medium capitalize">
                      {request.current_step.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>

                {request.approvals && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">
                      Approval Status:
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(request.approvals).map(
                        ([department, approval]) => {
                          const approvalObj =
                            typeof approval === "string"
                              ? { status: approval, remarks: "" }
                              : approval;
                          return (
                            <div
                              key={department}
                              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                            >
                              <div>
                                <p className="font-medium capitalize">
                                  {department.replace(/_/g, " ")}
                                </p>
                                {approvalObj.remarks && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    Remarks: {approvalObj.remarks}
                                  </p>
                                )}
                              </div>
                              <StatusIndicator
                                status={
                                  approvalObj.status === "approved"
                                    ? "approved"
                                    : approvalObj.status === "rejected"
                                    ? "rejected"
                                    : "pending"
                                }
                                showText
                              />
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default ClearanceHistory;
