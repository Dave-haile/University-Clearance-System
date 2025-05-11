
interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  let bgColor;
  const textColor = "text-white";

  switch (status.toLowerCase()) {
    case "pending":
      bgColor = "bg-orange-400";
      break;
    case "approved":
      bgColor = "bg-green-500";
      break;
    case "rejected":
      bgColor = "bg-red-500";
      break;
    default:
      bgColor = "bg-gray-400";
  }

  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
    >
      {formattedStatus}
    </span>
  );
};

export default StatusBadge;
