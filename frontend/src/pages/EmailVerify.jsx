import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const EmailVerify = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const inputsRef = useRef([]);

  // Move focus as the user types
  const handleChange = (value, idx) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[idx] = value;
      setOtp(newOtp);
      if (value && idx < 5) inputsRef.current[idx + 1].focus();
    }
  };

  // Backspace ⇽ move focus left
  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.some((d) => d === "")) return toast.error("Enter all six digits");
    const code = otp.join("");
    try {
      setSubmitting(true);
      // 👉 swap URL with your backend endpoint
      const { data } = await axios.post("/api/auth/verify-email", { code });
      data.success
        ? toast.success("Email verified!")
        : toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post("/api/auth/resend-otp");
      toast.success("OTP sent again");
    } catch (err) {
      toast.error(err.message);
    }
  };

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
        <h1 className="text-center text-3xl font-light text-gray-900">
          <span className="font-semibold">GEO</span>nex
        </h1>

        {/* Welcome text */}
        <h2 className="mt-4 text-center text-4xl font-semibold text-gray-900">
          OTP verification
        </h2>
        <p className="mt-1 text-center text-base text-gray-600">
          Enter the 6-digit code we sent to your email
        </p>

        {/* OTP inputs */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col items-center"
        >
          <div className="flex gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputsRef.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-10 h-12 md:w-12 md:h-14 rounded-md border border-gray-400 bg-transparent text-center text-xl font-semibold tracking-widest focus:border-indigo-500 focus:outline-none"
              />
            ))}
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-32 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "..." : "Submit"}
          </button>
        </form>

        {/* resend */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t you receive the OTP?{" "}
          <span
            onClick={handleResend}
            className="font-semibold text-indigo-600 hover:underline cursor-pointer"
          >
            Resend
          </span>
        </p>
      </div>
    </div>
  );
};

export default EmailVerify;
