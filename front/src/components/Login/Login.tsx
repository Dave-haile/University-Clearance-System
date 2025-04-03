import { MdArrowBackIos } from "react-icons/md";
import { useState } from "react";
// import { supabase } from "../../supabaseClient";
import { Link, useNavigate } from "react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { FromFields,schema } from "./Schema";
import { zodResolver } from "@hookform/resolvers/zod";



const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<FromFields>({ resolver: zodResolver(schema) });
  const onSubmit: SubmitHandler<FromFields> = async (formData) => {
    // try {
    //   const { data, error } = await supabase.auth.signInWithPassword({
    //     email: formData.email,
    //     password: formData.password,
    //   });

    //   if (error) {
    //     setError("root", {
    //       message: "Invalid login credentials" + error.message,
    //     });
    //     console.error("Login failed:", error.message);
    //     return;
    //   }
    //   const user = data.user;
    //   if (
    //     user &&
    //     user.email &&
    //     user.email.toLowerCase().includes("@iuncls.com")
    //   ) {
    //     navigate("/change-email-password");
    //   } else {
    //     console.log("Login successful:", user);
    //     navigate("/student2");
    //   }
    // } catch (error) {
    //   if (error instanceof Error) {
    //     setError("root", { message: error.message });
    //     console.log(error.message);
    //   }
    // }
  };
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className={`dark:bg-[#1F2937] bg-[#F9FAFB] overflow-hidden h-screen`}>
      <div className="flex items-center justify-center gap-x-[9rem] text-[var(--primary-color)] dark:text-[dodgerblue] font-semibold mt-5 p-1">
        <Link to={"/"}>
          <div className="cursor-pointer flex items-center text-[1rem] hover:underline">
            <MdArrowBackIos />
            Back to Home
          </div>
        </Link>
        <div className="cursor-pointer text-[1rem] hover:underline">Need any help</div>
      </div>

      {/* <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 w-11/12 sm:w-96 text-center"> */}
      <h1 className="text-2xl font-semibold text-gray-800 text-center dark:text-white mt-5 p-2">
        Login
      </h1>
      <p className="text-gray-500 leading-5 text-center dark:text-gray-400 mb-2">
        Sign-in to continue
      </p>

      <form
        className="flex flex-col justify-center items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="" className="relative">
          <input
            {...register("email")}
            value={email}
            type="text"
            className="my-2 mx-1 w-[270px] h-[30] xs:w-[360px] xs:h-[40px] md:w-[450px] md:h-[50px] px-6 py-3 rounded-full outline-none border-[1px] border-gray-400 focus:border-purple-500 transition duration-200"
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
          />
          <span className="absolute top-5 text-gray-500 left-0 mx-6 px-2 transition duration-300 input-text">
            {email ? "" : "Email"}
          </span>
          {errors.email && (
            <p className="text-red-500 text-base ml-3 text-left">
              {errors.email?.message}
            </p>
          )}
        </label>

        <label className="relative">
          <input
            {...register("password")}
            value={password}
            type={showPassword ? "text" : "password"}
            className="my-2 mx-1 w-[270px] h-[30] xs:w-[360px] xs:h-[40px] md:w-[450px] md:h-[50px] px-6 py-3 rounded-full outline-none border-[1px] border-gray-400 focus:border-purple-500 transition duration-200"
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
          />
          <span className="absolute w-[80px] top-5 text-gray-500 left-0 mx-6 px-2 transition duration-300 input-text">
            {password ? "" : "Password"}
          </span>
          {password &&  <img
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-[2.1rem] transform -translate-y-1/2 h-5 w-5 cursor-pointer"
            src={showPassword ? "/eye-off.svg" : "/eye.svg"}
            alt={showPassword ? "Hide" : "Show"}
          />}
          {errors.password && (
            <p className="text-red-500 text-base ml-3">
              {errors.password?.message}
            </p>
          )}
        </label>

        <button
          disabled={isSubmitting}
          type="submit"
          className="w-[270px] h-[30] xs:w-[360px] xs:h-[40px] md:w-[450px] md:h-[50px] p-2 md:p-0 hover:bg-[var(--primary-color-hover)] bg-[var(--primary-color)] text-white text-base font-medium md:font-semibold rounded-full mt-5 md:mt-4"
        >
          {isSubmitting ? "Loading..." : "Submit"}
        </button>
      </form>
      <div className="flex flex-col items-center">


        <p className="text-[1rem] text-gray-700 dark:text-gray-400 mb-4 mt-8">
          Don’t have an account? Ask Admin or Department Head for your details
        </p>
        <Link
          className="mt-4 text-[1.2rem] text-[var(--primary-color)] dark:text-[dodgerblue] hover:underline"
          to="/forget-password"
        >
          Forgot password
        </Link>
      </div>
    </div>
  );
};

export default Login;
