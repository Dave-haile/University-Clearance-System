
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ClearanceChartProps {
  statistics: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export const ClearanceChart = ({ statistics }: ClearanceChartProps) => {
  const data = [
    {
      name: "Approved",
      value: statistics.approved,
      color: "#10b981"
    },
    {
      name: "Pending", 
      value: statistics.pending,
      color: "#f59e0b"
    },
    {
      name: "Rejected",
      value: statistics.rejected, 
      color: "#ef4444"
    }
  ];

  const COLORS = {
    "Approved": "#10b981",
    "Pending": "#f59e0b", 
    "Rejected": "#ef4444"
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          Clearance Status Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Total Requests:</span>
            <span className="font-medium text-slate-900">{statistics.total}</span>
          </div>
          <div className="text-xs text-slate-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
