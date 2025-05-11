import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MonthStat } from '../../../../types/dashboard';

interface MonthlyTrendsChartProps {
  data: MonthStat[] | undefined;
}

const formatMonth = (month: string) => {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return date.toLocaleDateString('default', { month: 'short', year: 'numeric' });
};

const MonthlyTrendsChart: React.FC<MonthlyTrendsChartProps> = ({ data }) => {
  const formattedData = data?.map(item => ({
    ...item,
    formattedMonth: formatMonth(item.month),
  }));

  // If we only have one month of data, add a second point to make a line
  const chartData = formattedData?.length === 1 
    ? [
        { month: 'previous', formattedMonth: 'Previous', total: 0 },
        ...formattedData,
      ]
    : formattedData;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Request Trends</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="formattedMonth" 
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px',
              }}
              formatter={(value) => [`${value} requests`, 'Total']}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#3B82F6"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              name="Requests"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyTrendsChart;