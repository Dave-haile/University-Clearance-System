// ApprovalDots.tsx
import { Tooltip } from "../ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface ApprovalsProps {
  department_head?: boolean | null;
  library?: boolean | null;
  cafeteria?: boolean | null;
  proctor?: boolean | null;
  registrar?: boolean | null;
}

interface ApprovalDotsProps {
  approvals: ApprovalsProps | string | null; 
}

const ApprovalDots = ({ approvals }: ApprovalDotsProps) => {
  const parsedApprovals: ApprovalsProps = typeof approvals === 'string' 
    ? JSON.parse(approvals)
    : approvals || {
        department_head: null,
        library: null,
        cafeteria: null,
        proctor: null,
        registrar: null
      };

  const approvalSteps = [
    { name: "Department Head", status: parsedApprovals.department_head },
    { name: "Library", status: parsedApprovals.library },
    { name: "Cafeteria", status: parsedApprovals.cafeteria },
    { name: "Proctor", status: parsedApprovals.proctor },
    { name: "Registrar", status: parsedApprovals.registrar },
  ];

  return (
    <div className="flex space-x-2">
      <TooltipProvider>
        {approvalSteps.map((step, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div
                className={`w-3 h-3 rounded-full ${
                  step.status ? "bg-green-500 animate-pulse" : "bg-gray-300"
                }`}
              ></div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {step.name}: {step.status ? "Approved" : "Pending"}
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};

export default ApprovalDots;