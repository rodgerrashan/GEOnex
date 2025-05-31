import React, { useContext, useEffect, useState} from "react";
import ResetOtp from "../components/ResetOtp";
import ChangePassword from "../components/ChangePassword";
import VerifyResetOtp from "../components/VerifyResetOtp";
import { Context } from "../context/Context";

const ResetPassword = () => {

  const {navigate} = useContext(Context)

  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

  useEffect(() => {
      console.log("isEmailSent changed ➜", isEmailSent);
    }, [isEmailSent]);
  
    useEffect(() => {
      console.log("isOtpSubmitted changed ➜", isOtpSubmitted);
    }, [isOtpSubmitted]);

    useEffect(() => {
      console.log("otp changed ➜", otp);
    }, [otp]);
  

  return (
    <div
      className="min-h-dvh flex items-center justify-center
      sm:bg-[rgba(47,47,48,1)]"
    >
      <div
        className=" w-full min-h-dvh
      sm:min-h-fit sm:w-[26rem] sm:px-8
      sm:rounded-xl sm:shadow-lg 
      px-6 py-10
      bg-[rgba(217,217,217,1)]
      flex flex-col justify-center"
      >
        {/* Logo */}
        <h1 onClick={() => navigate("/")}
        className="text-center text-3xl font-light text-gray-900 cursor-pointer">
          <span className="font-semibold">GEO</span>nex
        </h1>

        {/* Send the reset OTP */}
        {!isEmailSent && (
          <ResetOtp
            email={email}
            setEmail={setEmail}
            setIsEmailSent={setIsEmailSent}
          />
        )}

        {/* Enter the 6-digit OTP */}
        {isEmailSent && !isOtpSubmitted && (
          <VerifyResetOtp
            otp={otp}
            setOtp={setOtp}
            setIsOtpSubmitted={setIsOtpSubmitted}
          />
        )}

        {/* Change password */}
        {isEmailSent && isOtpSubmitted && (
          <ChangePassword email={email} otp={otp.join("")} />
        )}

      </div>
    </div>
  );
};

export default ResetPassword;
