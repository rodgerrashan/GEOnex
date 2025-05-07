import React, { useContext, useState } from "react";
import { Context } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";

const ResetOtp = ({ email, setEmail, setIsEmailSent }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { backendUrl } = useContext(Context);

  axios.defaults.withCredentials = true;

  const onSubmitEmail = async (e) => {
    e.preventDefault();

    if (!email) return toast.error("Please enter your email.");

    try {
      setIsSubmitting(true);
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email }
      );
      if (data.success) {
        setIsEmailSent(true); 
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmitEmail} className="mt-4">
      {/* Heading */}
      <h2 className="text-center text-4xl font-semibold text-gray-900">
        Reset Password
      </h2>
      <p className="mt-1 text-center text-base text-gray-600">
        Enter your registered email address
      </p>

      {/* Email Input */}
      <div className="mt-8">
        <label
          htmlFor="email"
          className="block text-base font-medium text-gray-700"
        >
          Your email address
        </label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          id="email"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="name@example.com"
        />
      </div>

      {/* Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-32 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Please wait…" : "Send OTP"}
        </button>
      </div>
    </form>
  );
};

export default ResetOtp;
