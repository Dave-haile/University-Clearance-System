import React, { useState } from 'react';
import { Bell, Settings, Menu } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}


const notifications = [
  {
    id: '1',
    title: 'Clearance Update',
    content: 'Your Library clearance has been approved',
    timestamp: '1 hour ago',
    read: false
  },
  {
    id: '2',
    title: 'New Message',
    content: 'Finance department has sent you a message',
    timestamp: '3 hours ago',
    read: false
  },
  {
    id: '3',
    title: 'Submission Reminder',
    content: 'Deadline for clearance submission is next week',
    timestamp: '1 day ago',
    read: true
  }
];
const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-4 md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center">
            <div className="text-blue-900 font-semibold text-xl">Universal University</div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-700">Notifications</h3>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">No notifications</div>
                  ) : (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex justify-between">
                          <p className="font-medium text-sm text-gray-800">{notification.title}</p>
                          <span className="text-xs text-gray-500">{notification.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>

          <div className="hidden md:flex items-center">
            {/* <Avatar 
              src={currentStudent.avatar} 
              alt={currentStudent.name} 
              size="sm"
            /> */}
          </div>
        </div>
      </div>
      {/* <div className="px-4 py-2 bg-blue-800 text-white">
        <h1 className="text-lg font-medium">Student Dashboard</h1>
      </div> */}
    </header>
  );
};

export default Header;