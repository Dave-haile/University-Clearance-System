import React from 'react';
import { GoogleLoader } from './GoogleLoder';

interface StatsCardProps {
  title: string;
  value: string | number | React.ReactNode;
  icon?: React.ReactNode;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  isLoading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  trend,
  className = '',
  isLoading = false,
}) => {
  const trendColor = trend === 'up' ? 'text-success-500' : trend === 'down' ? 'text-error-500' : 'text-gray-500';

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="mt-1 text-4xl font-semibold text-gray-900 whitespace-nowrap">{value}</div>
          
          {typeof change !== 'undefined' && (
            <div className={`flex items-center mt-2 ${trendColor}`}>
              <span className="flex items-center text-sm font-medium">
                {trend === 'up' ? (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                ) : trend === 'down' ? (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" />
                  </svg>
                )}
                {change}%
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-500">
            {icon}
          </div>
        )}
        {isLoading && (
          <GoogleLoader/>
        )}
      </div>
    </div>
  );
};

export default StatsCard;