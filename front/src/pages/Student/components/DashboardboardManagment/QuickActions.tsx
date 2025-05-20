import React from 'react';
import { FileUp, History, } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';

const QuickActions: React.FC = () => {
  const actionsData = [
    {
      id: 'submit',
      title: 'Submit New Request',
      description: 'Start a new clearance application',
      icon: <FileUp size={18} />,
      variant: 'primary'
    },
    {
      id: 'history',
      title: 'View History',
      description: 'Access your past clearance records',
      icon: <History size={18} />,
      variant: 'outline' as const
    },
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {actionsData.map((action) => (
            <div 
              key={action.id}
              className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  p-2 rounded-lg text-white
                  ${action.variant === 'primary' ? 'bg-blue-800' : 'bg-gray-100 text-gray-700'}
                `}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{action.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                  <Button
                    variant={action.variant === 'primary' ? 'primary' : 'outline'}
                    size="sm"
                    className="mt-2 w-full"
                  >
                    {action.variant === 'primary' ? 'Start Now' : 'View'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;