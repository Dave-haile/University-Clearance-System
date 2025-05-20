import { ApprovalClearanceStatusCard } from "@/types/clerance";

const ApprovalParse = ({approvals}: Partial<ApprovalClearanceStatusCard>) => {
const parsedApprovals = typeof approvals === 'string' 
    ? JSON.parse(approvals) 
    : approvals || {};

  const approvalSteps = [
    {
      id: "1",
      name: "Department Head",
      status: parsedApprovals.department_head ?? null,
    },
    { 
      id: "2", 
      name: "Library", 
      status: parsedApprovals.library ?? null 
    },
    { 
      id: "3", 
      name: "Cafeteria", 
      status: parsedApprovals.cafeteria ?? null 
    },
    { 
      id: "4", 
      name: "Proctor", 
      status: parsedApprovals.proctor ?? null 
    },
    { 
      id: "5", 
      name: "Registrar", 
      status: parsedApprovals.registrar ?? null 
    },
  ];

  return approvalSteps
}

export default ApprovalParse
