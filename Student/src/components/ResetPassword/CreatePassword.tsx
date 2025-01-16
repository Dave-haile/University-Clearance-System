import { MdArrowBack } from "react-icons/md";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

function CreatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Handle password reset logic here
  };

  return (
    <div className="flex items-center justify-center h-screen font-[Segoe UI] dark:bg-[#1F2937]">
      <div className="p-[2rem] w-[550px] shadow-2xl h-[85%] hover:shadow-xl transition-shadow rounded-3xl dark:shadow-[#2f3846]">
        <div className="flex items-center mb-6 dark:text-gray-100 ">
          <button
            onClick={() => {
              navigate("/");
            }}
            className="mt-3 text-base cursor-pointer flex gap-2 items-center"
          >
            <MdArrowBack className="text-2xl hover:-translate-x-[2px] transition-[2s]" />{" "}
            Quit
          </button>
        </div>
        <h1 className="text-[26px] font-semibold mb-4 dark:text-gray-100">
          Create new password
        </h1>
        <p className="text-gray-500 font-semibold mb-4 dark:text-gray-100">
          Your new password must be different from previous used passwords.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 relative">
            <label
              htmlFor="password"
              className="dark:text-gray-100 text-base text-gray-500"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="p-3 border-[#ddd] rounded-xl text-[18px] border-2 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {password ? (
              <img
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                className=" cursor-pointer absolute w-[25px] translate-x-[27rem] translate-y-[2.8rem] "
                src={showPassword ? "/eye-off.svg" : "/eye.svg"}
                alt="show"
              />
            ) : (
              ""
            )}
            <span className="text-gray-500 dark:text-gray-300">
              Must be at least 6 characters.
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirm-password"
              className="dark:text-gray-100 text-base text-gray-500"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              className="p-3 border-gray-300 rounded-xl text-[18px] border-2 focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span className="dark:text-gray-300 text-gray-500">Both passwords must match.</span>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button
            type="submit"
            className="mt-6 bg-[#2563eb] text-white border-none p-[14px] rounded-xl transition-[2s] cursor-pointer hover:bg-[#1e5de3]"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
export default CreatePassword;
