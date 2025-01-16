import { useState } from 'react';
import Login from './Login';

export const AccountReminder = ({handleOkayClick}) => {

  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 dark:bg-[#1F2937]">
      <div className="bg-white p-6 rounded-lg shadow-lg h-[300px] max-w-screen-md w-full dark:bg-[#1F2937] dark:shadow-slate-600  ">
        <h2 className="text-4xl font-semibold text-center mb-4 dark:text-gray-300">Account Required</h2>
        <p className="text-center text-[22px] mb-4 dark:text-gray-300">
          If you don't have an account, please ask your department head to create one for you.
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleOkayClick}
            className="px-[5%] mt-3 py-[1%] text-2xl bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};
export const LoginParent = () =>{
  const [step, setStep] = useState(true);

  const handleOkayClick = () => {
    setStep(false) // Replace '/login' with your login page route
  };
  return(
    <div>
      {step ? <AccountReminder handleOkayClick={handleOkayClick} /> : <Login/>}
    </div>
  )

}
