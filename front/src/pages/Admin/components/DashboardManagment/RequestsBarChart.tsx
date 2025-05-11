import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Totals } from '../../../../types/dashboard';

interface RequestsBarChartProps {
  data: Totals | undefined;
}

const RequestsBarChart: React.FC<RequestsBarChartProps> = ({ data }) => {
  const chartData = [
    {
      name: 'All',
      value: data?.all,
      fill: '#6366F1', // indigo
    },
    {
      name: 'Approved',
      value: data?.approved,
      fill: '#10B981', // green
    },
    {
      name: 'Pending',
      value: data?.pending,
      fill: '#F59E0B', // amber
    },
    {
      name: 'Rejected',
      value: data?.rejected,
      fill: '#EF4444', // red
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Clearance Request Status</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="value" name="Requests" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RequestsBarChart;