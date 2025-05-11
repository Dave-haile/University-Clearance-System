// import { toast } from 'sonner';

import { toast } from 'sonner';
import { toast as ReactToast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const ReactNotifySuccess = () => ReactToast.success("🎉 Success! All good.");
export const ReactNotifyError = () => ReactToast.error("💥 Oops! Something went wrong.");
export const ReactNotifyInfo = () => ReactToast.info("ℹ️ FYI: Updates available.");
export const ReactNotifyWarning = () => ReactToast.warn("⚠️ Be careful!");
export const ReactNotifyLoading = () => ReactToast.loading("⏳ Loading...");
export const btnStyle =
  "bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200";
// const showWelcomeToast = () => {
//   ReactToast(
//     <div className="p-4">
//       <h3 className="font-semibold text-lg text-green-600">Welcome back!</h3>
//       <p className="text-sm text-gray-700">You've successfully logged in.</p>
//     </div>,
//     {
//       className: "bg-white rounded-lg shadow-md",
//       progressClassName: "bg-green-400",
//       position: "top-center",
//       autoClose: 4000,
//     }
//   );
// };
// <div className="flex flex-wrap gap-4">
// <button
//   onClick={() => {
//     notifySuccess();
//     console.log("clicked");
//   }}
//   className={`${btnStyle} bg-green-600 hover:bg-green-700`}
// >
//   Show Success
// </button>
// </div>
// <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />




export const showSuccess = (message: string,) =>
  toast.success(message, { duration: 3000 });

export const showError = (message: string) =>
  toast.error(message, { duration: 3000 });

export const showInfo = (message: string) =>
  toast(message, { duration: 3000 });

export const showLoading = (message: string) =>
  toast.loading(message, { duration: 3000 });

export const notifySuccess = (message: string, title = '✅ Success') => {
  toast.success(message, {
    description: title,
    duration: 3000,
  });
};

export const notifyError = (message: string, title = '🚨 Error') => {
  toast.error(message, {
    description: title,
    duration: Infinity,
  });
};

export const notifyInfo = (message: string, title = 'ℹ️ Info') => {
  toast(message, {
    description: title,
    duration: 3000,
  });
};

export const notifyWarning = (message: string, title = '⚠️ Warning') => {
  toast.warning(message, {
    description: title,
    duration: 3000,
  });
};

// User-specific helpers
export const toastForAdmin = {
  success: (msg: string) => notifySuccess('🎉', msg),
  error: (msg: string) => notifyError('💥', msg,),
  info: (msg: string) => notifyInfo('ℹ️', msg),
};

export const toastForStaff = {
  success: (msg: string) => notifySuccess(msg, '🧑‍🔧 Staff Success'),
  error: (msg: string) => notifyError(msg, '🧑‍🔧 Staff Error'),
  info: (msg: string) => notifyInfo(msg, '🧑‍🔧 Staff Info'),
};

export const toastForStudent = {
  success: (msg: string) => notifySuccess(msg, '🎓 Student Success'),
  error: (msg: string) => notifyError(msg, '🎓 Student Error'),
  info: (msg: string) => notifyInfo(msg, '🎓 Student Info'),
};
export const toastForUsers = {

}

