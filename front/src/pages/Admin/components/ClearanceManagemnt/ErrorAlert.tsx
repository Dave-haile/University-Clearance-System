
import { Button } from "../ui/button";

interface ErrorAlertProps {
  message: string;
  onRetry: () => void;
}

const ErrorAlert = ({ message, onRetry }: ErrorAlertProps) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center justify-center">
      <div className="rounded-full bg-red-100 p-3 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Data</h3>
      <p className="text-red-600 mb-4 text-center">{message}</p>
      <Button onClick={onRetry} className="bg-red-500 hover:bg-red-600">
        Try Again
      </Button>
    </div>
  );
};

export default ErrorAlert;
