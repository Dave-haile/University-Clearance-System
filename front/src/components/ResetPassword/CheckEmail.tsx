
interface CheckMailProps {
    email: string;
    onSkip: () => void;
  }

function CheckMail() {
  return (
    <div className="flex items-center justify-center h-screen font-[Segoe UI] dark:bg-[#1F2937]">
      <div className="flex items-center justify-center flex-col p-[2rem] w-[550px] shadow-2xl h-[85%] hover:shadow-xl transition-shadow rounded-3xl dark:shadow-[#2f3846]">
        <div className="w-[150px] ">
          <img className="" src="/email.png" alt="email icon" />
        </div>
        <h1 className="text-[26px] font-semibold mb-4 dark:text-gray-100">
          Check your mail
        </h1>
        <p className="text-gray-500 font-semibold mb-4 dark:text-gray-100">
          We have sent a password recover instructions to your email.
        </p>
        <p className="text-gray-500 font-semibold mb-4 dark:text-gray-100">
          Press Reset Password link and it will redirect you us
        </p>
        <button
          className="w-[50%] bg-[#2563eb] mt-5 text-white border-none p-[14px] rounded-xl transition-[2s] cursor-pointer hover:bg-[#1e5de3] "
          onClick={() => window.open("mailto:")}
        >
          Open email
        </button>
        <button className="p-2 mt-8 border-none bg-transparent dark:text-gray-100 leading-loose">Skip, I'll confirm later</button>
        <p className="dark:text-gray-100 text-[14px] mt-[8rem]">
          Did not receive the email? Check your spam filter,
          or <br /> <button className="text-[#2563eb] ml-20 mt-4 border-none hover:underline cursor-pointer  ">try another email address</button>
        </p>
      </div>
    </div>
  );
}
export default CheckMail;
