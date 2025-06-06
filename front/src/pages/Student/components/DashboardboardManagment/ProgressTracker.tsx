import { Card, CardHeader, CardContent } from "../ui/Card";
import StatusIndicator from "../ui/StatusIndicator";
import { ClearanceStatusCardProps } from "./ClearanceStatusCard";

const ProgressTracker = ({ approvals }: ClearanceStatusCardProps) => {
  const parsedApprovals =
    typeof approvals === "string" ? JSON.parse(approvals) : approvals || {};

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
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-800">
          Clearance Progress
        </h2>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Vertical line connecting steps */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-6">
            {approvalSteps.map((step, index) => (
              <div key={step.id} className="relative flex items-start pl-10">
                {/* Step indicator */}
                <div className="absolute left-0 mt-1">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${
                        step?.status?.status === "approved"
                          ? "bg-green-500"
                          : step?.status?.status === "rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }
                      text-white text-sm font-medium z-10
                    `}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Step content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium text-gray-800">
                      {step.name}
                    </h3>
                    <StatusIndicator status={step?.status?.status} showText />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {step?.status?.status === "approved" ? (
                      `${step?.name} department has approved your clearance.`
                    ) : step?.status?.status === "rejected" ? (
                      <>
                        {step?.name} rejected because{" "}
                        <span className="font-bold">
                          {rejectedApproval?.status.remarks}
                        </span>
                        .
                      </>
                    ) : (
                      `Waiting for approval from ${step?.name} department.`
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
