import { ReactNode } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '../../pages/Admin/lib/utils';

interface ChartProps {
  data: Array<any>;
  type?: 'line' | 'bar';
  xKey: string;
  yKey: string;
  title?: string;
  description?: string;
  className?: string;
  height?: number;
  color?: string;
  children?: ReactNode;
}

export const Chart = ({
  data,
  type = 'line',
  xKey,
  yKey,
  title,
  description,
  className,
  height = 300,
  color = "#3B82F6",
  children,
}: ChartProps) => {
  return (
    <div className={cn("dashboard-card", className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      )}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
              <XAxis dataKey={xKey} tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  border: "none",
                }}
              />
              <Line
                type="monotone"
                dataKey={yKey}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              {children}
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
              <XAxis dataKey={xKey} tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  border: "none",
                }}
              />
              <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
              {children}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
