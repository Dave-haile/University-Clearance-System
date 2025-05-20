import React from 'react';

interface StatusIndicatorProps {
  status: 'approved' | 'pending' | 'rejected';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const statusConfig = {
  approved: {
    color: 'bg-green-500',
    ringColor: 'ring-green-200',
    pulseColor: 'bg-green-400',
    text: 'approved'
  },
  pending: {
    color: 'bg-yellow-500',
    ringColor: 'ring-yellow-200',
    pulseColor: 'bg-yellow-400',
    text: 'Pending'
  },
  rejected: {
    color: 'bg-red-500',
    ringColor: 'ring-red-200',
    pulseColor: 'bg-red-400',
    text: 'Rejected'
  }
};

const sizeClasses = {
  sm: 'w-2.5 h-2.5',
  md: 'w-3.5 h-3.5',
  lg: 'w-5 h-5'
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  size = 'md', 
  showText = false,
  className = '' 
}) => {

  const { color, ringColor, text } = statusConfig[status || 'pending'];
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span 
        className={`
          relative inline-flex rounded-full ${color} ${sizeClasses[size]} 
          ${status === 'pending' ? 'animate-pulse' : ''}
          ring-2 ${ringColor}
        `} 
      />
      {showText && (
        <span className="text-sm font-medium text-gray-700">
          {text}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;