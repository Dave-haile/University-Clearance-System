
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentName: string;
}

export const ApprovalModal = ({ isOpen, onClose, onConfirm, studentName }: ApprovalModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Approve Clearance Request
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-slate-600">
            Are you sure you want to approve the clearance request for{" "}
            <span className="font-medium text-slate-900">{studentName}</span>?
          </p>
          <p className="text-sm text-slate-500 mt-2">
            This action will mark the request as approved and notify the student.
          </p>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={onConfirm}
          >
            Approve Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
