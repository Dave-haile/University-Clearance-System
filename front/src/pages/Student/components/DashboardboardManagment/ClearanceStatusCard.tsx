import { ApprovalClearanceStatusCard2, ClearanceStatus } from "@/types/clerance";
import { Card, CardHeader, CardContent } from "../ui/Card";
import StatusIndicator from "../ui/StatusIndicator";

export interface ClearanceStatusCardProps {
  approvals: Partial<ApprovalClearanceStatusCard2>;
  status: ClearanceStatus;
}

const ClearanceStatusCard = ({
  approvals,
  status,
}: ClearanceStatusCardProps) => {
  const parsedApprovals = typeof approvals === "string" ? JSON.parse(approvals) : approvals || {};

  const approvalSteps = [
    {
      id: "1",
      name: "Department Head",
      status: parsedApprovals.department_head ?? null,
    },
    {
      id: "2",
      name: "Library",
      status: parsedApprovals.library ?? null,
    },
    {
      id: "3",
      name: "Cafeteria",
      status: parsedApprovals.cafeteria ?? null,
    },
    {
      id: "4",
      name: "Proctor",
      status: parsedApprovals.proctor ?? null,
    },
    {
      id: "5",
      name: "Registrar",
      status: parsedApprovals.registrar ?? null,
    },
  ];



  const rejectedApproval = approvalSteps.find(
    (step) => step.status?.status === "rejected"
  );
  
  // if (rejectedApproval) {
  //   const rejectedDepartmentInfo: ApprovalsForReject = {
  //     remarks: rejectedApproval.status.remarks,
  //     timeStamp: rejectedApproval.status.timestamp,
  //     approved_by: rejectedApproval.status.approved_by,
  //     status: rejectedApproval.status.status,
  //   };
  //   // Now you can use rejectedDepartmentInfo as needed
  // } else {
  //   console.log("No rejections found");
  // }

  const statusMessages = {
    approved: "You have been successfully cleared. Congratulations!",
    pending:
      "Your clearance is in progress. Please complete all required steps.",
    rejected: <>Your clearance has been rejected in {rejectedApproval?.name} because of <span className="font-bold text-red-500">{rejectedApproval?.status.remarks}</span> </>,
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Clearance Status
        </h2>
        <StatusIndicator status={status} size="md" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-6">
          <div className="relative">
            <div
              className={`
                w-36 h-36 rounded-full flex items-center justify-center
                ${
                  status === "approved"
                    ? "bg-green-100"
                    : status === "pending"
                    ? "bg-yellow-100"
                    : "bg-red-100"
                }
              `}
            >
              <div
                className={`
                  w-28 h-28 rounded-full flex items-center justify-center text-white
                  ${
                    status === "approved"
                      ? "bg-green-500"
                      : status === "pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }
                `}
              >
                <span className="text-2xl font-bold">
                  {status === "approved"
                    ? "Approved"
                    : status === "pending"
                    ? "Pending"
                    : "Rejected"}
                </span>
              </div>
            </div>
            <div className="absolute -top-1 -right-1">
              <StatusIndicator status={status} size="lg" />
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 mt-4">
          {statusMessages[status]}
        </p>

        <div className="mt-4">
          <h3 className="font-medium text-gray-700 mb-2">
            Completion Summary:
          </h3>
          <div className="space-y-2">
            {approvalSteps.map((step) => (
              <div key={step.id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{step.name}</span>
                <StatusIndicator
                  // status={step.status === true ? 'approved' : step.status === false ? 'rejected' : 'pending'}
                  status={
                    step?.status?.status === undefined
                      ? "pending"
                      : step?.status?.status
                  }
                  size="sm"
                  showText
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClearanceStatusCard;
