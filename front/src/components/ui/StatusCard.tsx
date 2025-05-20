import React from 'react';

interface StatusCardProps {
  label: string;
  count: number;
}

const StatusCard: React.FC<StatusCardProps> = ({ label, count }) => {
  return (
    <div className="flex flex-col items-center p-4">
      <span className="text-gray-700 mb-1">{label}</span>
      <span className="text-2xl font-bold">{count}</span>
    </div>
  );
};

export default StatusCard;