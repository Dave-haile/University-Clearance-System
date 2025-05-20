
import { Button } from "../../../../components/ui/button";

interface EmptyStateProps {
  onRefresh: () => void;
}

const EmptyState = ({ onRefresh }: EmptyStateProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-center">
      <div className="bg-blue-50 p-4 rounded-full mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">No Clearance Requests Found</h3>
      <p className="text-gray-500 mb-6 max-w-md">
        There are no clearance requests matching your current filters. Try adjusting your filters or check back later.
      </p>
      <div className="space-x-4">
        <Button onClick={onRefresh} className="bg-blue-500 hover:bg-blue-600">
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default EmptyState;
