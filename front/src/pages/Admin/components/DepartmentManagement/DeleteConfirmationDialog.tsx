import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  department: string;
  college: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  isOpen: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  department,
  college,
  onClose,
  onConfirm,
  isOpen,
}) => {
  const [internalIsDeleting, setInternalIsDeleting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleDelete = async () => {
    setInternalIsDeleting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onConfirm();
    } catch (error) {
      console.error('Error deleting department:', error);
      alert('Failed to delete department. Please try again.');
    } finally {
      setInternalIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 overflow-y-auto h-full w-full z-[48] flex items-center justify-center">
      <div ref={dialogRef} className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-fade-in-up">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
          <h3 className="text-xl font-semibold text-gray-900">
            Confirm Deletion
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
          >
            <X size={20} />
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        
        <div className="p-4 md:p-5">
          <div className="flex items-center gap-3 mb-4 text-amber-600">
            <AlertTriangle size={24} />
            <h4 className="text-lg font-medium">Warning: This action cannot be undone</h4>
          </div>
          
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete the department <strong>{department}</strong> whose <strong>{college}</strong>  ? 
            This will permanently remove the department and all associated data.
          </p>
          
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-700 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={internalIsDeleting}
              className={`text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                internalIsDeleting ? 'opacity-75 cursor-wait' : ''
              }`}
            >
              {internalIsDeleting ? 'Deleting...' : 'Delete Department'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;