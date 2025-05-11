import { useState } from "react";
import ForgotPasswordButton from "../../components/ResetPassword/ForgetBtn";
import CheckEmail from "../../components/ResetPassword/CheckEmail";

const ResetPasswordFlow = () => {
  const [step, setStep] = useState("forget"); // 'forget' or 'create'

  const handleEmailSent = () => {
    setStep("check"); // Switch to the CreatePassword step
  };

  return (
    <div>
      {step === "forget" && <ForgotPasswordButton onEmailSent={handleEmailSent} />}
      {step === "check" && <CheckEmail />}
    </div>
  );
};

export default ResetPasswordFlow;
