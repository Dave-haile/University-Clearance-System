import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/context";
import AppRouter from "./routes/routes2";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" richColors closeButton />
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

{
  /* <HomePage />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      /> */
}
// // HomePage.jsx or HomePage.tsx
// import React from 'react';
// import { toast } from 'react-toastify';

// function HomePage() {
//   const notifySuccess = () => {
//     toast.success('✔️ Success! Operation completed.');
//   };

//   const notifyError = () => {
//     toast.error('❌ Error! Something went wrong.');
//   };

//   const notifyInfo = () => {
//     toast.info('ℹ️ Heads up! Check your inbox.');
//   };

//   const notifyWarning = () => {
//     toast.warn('⚠️ Warning! Please be careful.');
//   };

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h1>React Toast Notifications</h1>
//       <button onClick={notifySuccess}>Show Success Toast</button>
//       <button onClick={notifyError}>Show Error Toast</button>
//       <button onClick={notifyInfo}>Show Info Toast</button>
//       <button onClick={notifyWarning}>Show Warning Toast</button>
//     </div>
//   );
// }

// export default HomePage;
// src/pages/HomePage.tsx
// import React from 'react';
// import { toast } from 'react-toastify';

// const HomePage: React.FC = () => {
//   const notifySuccess = () => toast.success('🎉 Success! All good.');
//   const notifyError = () => toast.error('💥 Oops! Something went wrong.');
//   const notifyInfo = () => toast.info('ℹ️ FYI: Updates available.');
//   const notifyWarning = () => toast.warn('⚠️ Be careful!');

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h1>React Toastify Demo (Vite + TypeScript)</h1>

//       <button onClick={notifySuccess} style={{ margin: '0.5rem' }}>
//         Show Success
//       </button>
//       <button onClick={notifyError} style={{ margin: '0.5rem' }}>
//         Show Error
//       </button>
//       <button onClick={notifyInfo} style={{ margin: '0.5rem' }}>
//         Show Info
//       </button>
//       <button onClick={notifyWarning} style={{ margin: '0.5rem' }}>
//         Show Warning
//       </button>
//     </div>
//   );
// };

// export default HomePage;

// export const showApiError = (msg: string) => {
//   toast.error(`❌ API Error: ${msg}`, {
//     position: 'bottom-right',
//     autoClose: 5000,
//     closeOnClick: true,
//     draggable: true,
//   });
// };
// import { showApiError } from '../utils/toasts';

// showApiError("Invalid user credentials");
