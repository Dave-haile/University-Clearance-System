import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ForgotPasswordButton = ({ onEmailSent }: { onEmailSent: () => void }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  // const [CheckEmail, setCheckEmail] = useState(false);
  const navigate = useNavigate()

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:5173/reset-password",
      });

      if (error) {
        setMessage("Error sending reset email: " + error.message);
      } else {
        setMessage(
          "If this email is associated with an account, you will receive a password reset link."
        );
        setTimeout(onEmailSent, 1000);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen font-[Segoe UI] dark:bg-[#1F2937]">
      <div className="p-[2rem] w-[550px] shadow-2xl h-[85%] hover:shadow-xl transition-shadow rounded-3xl dark:shadow-[#2f3846] ">
        <div className="flex items-center mb-6 dark:text-gray-100 ">
          <button onClick={()=>{
            navigate(-1)
          }} className="mt-3 text-base cursor-pointer flex gap-2 items-center">
            <MdArrowBack className="text-2xl hover:-translate-x-[2px] transition-[2s]" /> Back
          </button>
        </div>
        <h1 className="text-[26px] font-semibold mb-4 dark:text-gray-100">Reset password</h1>
        <p className="text-gray-500 font-semibold mb-4 dark:text-gray-100">
          Enter the email associated with your account and we'll send an email
          with instructions to reset your password.
        </p>
        <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label  htmlFor="email" className="dark:text-gray-100 text-base text-gray-500">
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="p-3 border-gray-300 rounded-xl text-[18px] border-2 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2563eb] mt-5 text-white border-none p-[14px] rounded-xl transition-[2s] cursor-pointer hover:bg-[#1e5de3] "
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPasswordButton;
