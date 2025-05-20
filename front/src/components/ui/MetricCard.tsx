
import { ReactNode } from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "../../pages/Admin/lib/utils";


interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: ReactNode;
  className?: string;
}

export const MetricCard = ({
  title,
  value,
  description,
  trend,
  trendValue,
  icon,
  className,
}: MetricCardProps) => {
  return (
    <div className={cn("dashboard-card card-interactive", className)}>
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium text-gray-500 text-sm">{title}</h3>
          <p className="text-2xl font-bold mt-2">{value}</p>
          {description && <p className="text-gray-500 text-xs mt-1">{description}</p>}
        </div>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      
      {trend && (
        <div className="mt-3 flex items-center">
          <span
            className={cn("flex items-center text-xs font-medium", {
              "text-green-600": trend === "up",
              "text-red-600": trend === "down",
              "text-gray-500": trend === "neutral",
            })}
          >
            {trend === "up" && <ArrowUp className="mr-1 h-3 w-3" />}
            {trend === "down" && <ArrowDown className="mr-1 h-3 w-3" />}
            {trend === "neutral" && <Minus className="mr-1 h-3 w-3" />}
            {trendValue}
          </span>
          <span className="ml-1.5 text-xs text-gray-500">from last month</span>
        </div>
      )}
    </div>
  );
};
