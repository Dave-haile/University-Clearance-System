
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white rounded-md shadow p-4 flex flex-col">
      <span className="text-gray-700 text-sm font-medium">{title}</span>
      <span className="text-gray-900 text-3xl font-bold mt-1">{value}</span>
    </div>
  );
};

export default StatCard;