import React from 'react';
import { FolderOpen, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  onRefresh: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onRefresh }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-10 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <FolderOpen size={32} className="text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Departments Found</h3>
      <p className="text-gray-600 max-w-md mb-6">
        There are no departments matching your current filters. Try adjusting your filters or add a new department.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRefresh}
          className="flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <span>Create New Department</span>
        </button>
      </div>
    </div>
  );
};

export default EmptyState;