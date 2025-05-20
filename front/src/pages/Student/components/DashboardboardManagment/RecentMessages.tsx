import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';

interface Message {
  id: string;
  sender: string;
  department: string;
  content: string;
  timestamp: string;
  read: boolean;
}

const recentMessages: Message[] = [
  {
    id: '1',
    sender: 'Dr. Sarah Wilson',
    department: 'Department Head',
    content: 'Your course registration has been approved. Please complete your clearance.',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: '2',
    sender: 'Library Admin',
    department: 'Library',
    content: 'All borrowed books have been returned. Library clearance approved.',
    timestamp: '1 day ago',
    read: true
  },
  {
    id: '3',
    sender: 'Finance Office',
    department: 'Finance',
    content: 'Your tuition payment has been confirmed. Finance department clearance approved.',
    timestamp: '3 days ago',
    read: true
  },
  {
    id: '4',
    sender: 'Sports Director',
    department: 'Sports',
    content: 'Please return the sports equipment before clearance can be approved.',
    timestamp: '5 days ago',
    read: true
  }
];

const RecentMessages: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Recent Messages</h2>
        <Badge variant="info">{recentMessages.length}</Badge>
      </CardHeader>
      <CardContent>
        {recentMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentMessages.map((message) => (
              <div 
                key={message.id} 
                className={`
                  p-3 rounded-lg border 
                  ${!message.read ? 'bg-blue-50 border-blue-100' : 'bg-white border-gray-100'}
                `}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{message.sender}</p>
                    <p className="text-xs text-gray-500">{message.department}</p>
                  </div>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                </div>
                <p className="mt-2 text-sm text-gray-700">{message.content}</p>
                {!message.read && (
                  <div className="mt-2 flex justify-end">
                    <Badge variant="info" className="text-xs">New</Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Messages
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentMessages;