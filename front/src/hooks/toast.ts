import { toast } from "@/pages/Admin/hooks/Toast";

export const btnStyle =
  "bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200";

export const showSuccess = (message: string) =>
  toast.success(message, { duration: 3000 });

export const showError = (message: string) =>
  toast.error(message, { duration: 3000 });

export const showInfo = (message: string) =>
  toast.info(message, { duration: 3000 });

export const showLoading = (message: string) =>
  toast.loading(message, { duration: 3000 });

export const notifySuccess = (message: string, title = "Success") => {
  toast.success(message, {
    description: title,
    duration: 3000,
  });
};

export const notifyError = (message: string, title = "Error") => {
  toast.error(message, {
    description: title,
    duration: Infinity,
  });
};

export const notifyInfo = (message: string, title = "Info") => {
  toast.info(message, {
    description: title,
    duration: 3000,
  });
};

export const notifyWarning = (message: string, title = "Warning") => {
  toast.warning(message, {
    description: title,
    duration: 3000,
  });
};

export const toastForAdmin = {
  success: (msg: string) => notifySuccess(msg, "Admin Success"),
  error: (msg: string) => notifyError(msg, "Admin Error"),
  info: (msg: string) => notifyInfo(msg, "Admin Info"),
};

export const toastForStaff = {
  success: (msg: string) => notifySuccess(msg, "Staff Success"),
  error: (msg: string) => notifyError(msg, "Staff Error"),
  info: (msg: string) => notifyInfo(msg, "Staff Info"),
};

export const toastForStudent = {
  success: (msg: string) => notifySuccess(msg, "Student Success"),
  error: (msg: string) => notifyError(msg, "Student Error"),
  info: (msg: string) => notifyInfo(msg, "Student Info"),
};

export const toastForUsers = {};
