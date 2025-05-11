// import { toast, Toaster } from "sonner";
// import { showError, showLoading, showSuccess, toastForAdmin, toastForStudent } from "../hooks/toast";

// const Toast = () => {

// const handleUpdateUser = async () => {
//   try {
//     await new Promise((resolve) => setTimeout(resolve, 2000));  
//     toastForAdmin.success('User updated successfully 🎉');
//   } catch (error) {
//     toastForAdmin.error(`Failed to update user ❌${error.message}`);
//   }
// };

// const handleStudentClearance = async () => {
//   try {
//     // await axios.post('/clearance/submit');
//     await new Promise((resolve,rej) => setTimeout(rej, 2000));
//     toastForStudent.success('Clearance submitted 📝');
//   } catch (error) {
//     toastForStudent.error('You have already submitted! 🚫');
//   }
// };

//   const simulateApiCall = async () => {
//     const loadingToast = showLoading("Submitting form...");

//     try {
//       // Simulate API call
//       const apiCall = await new Promise((res,rej) => setTimeout(rej, 2000));
//       toast.dismiss(loadingToast);
//       showSuccess("✅ Data submitted successfully!");
//     } catch (err) {
//       showError("❌ Failed to submit data.");
//     }
//   };

//   const handleLogin = async () => {
//     const toastId = showLoading("Logging in...");

//     try {
//       await new Promise((res, rej) => {
//         setTimeout(res, 2000);
//       });
//       toast.dismiss(toastId);
//     showSuccess('Welcome back!');
//     } catch (err) {
//         toast.dismiss(toastId);
//       showError("Login failed: Invalid credentials");
//     }
//   };
//   return (
//     <>
//       <div className="p-8">
//         <h1 className="text-2xl font-bold mb-4">Sonner Toast Example</h1>
//         <button
//           onClick={simulateApiCall}
//           className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
//         >
//           Simulate API Call
//         </button>
//       </div>
//       <div className="p-8">
//         <h1 className="text-2xl font-bold mb-4">Sonner Toast Example</h1>
//         <button
//           onClick={handleLogin}
//           className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
//         >
//           Simulate API Call
//         </button>
//       </div>
//         <div className="p-8">
//             <h1 className="text-2xl font-bold mb-4">Sonner Toast Example</h1>
//             <button
//             onClick={handleUpdateUser}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
//             >
//             handle Update User
//             </button>
//         </div>
//         <div className="p-8">
//             <h1 className="text-2xl font-bold mb-4">Sonner Toast Example</h1>
//             <button
//             onClick={handleStudentClearance}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
//             >
//             handle Student Clearance
//             </button>
//         </div>
//       <Toaster position="top-center" richColors closeButton />
      
//       {/* <Toaster
//         position="top-right"
//         expand={true}
//         richColors
//         toastOptions={{
//           classNames: {
//             toast:
//               "rounded-xl shadow-md border bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100",
//             title: "text-base font-semibold",
//             description: "text-sm",
//           },
//         }}
//       /> */}
//     </>
//   );
// };

// export default Toast;
