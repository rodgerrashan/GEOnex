import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { Context } from "../context/Context";
import axios from "axios";

const ChangePassword = ({ email, otp }) => {
  const { navigate, backendUrl,authPort } = useContext(Context);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      return toast.error("Please fill in both fields.");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setIsSubmitting(true);
      const { data } = await axios.post(
        `${backendUrl}${authPort}/api/auth/reset-password`,
        { email, otp, newPassword }
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="mt-4" onSubmit={onSubmitNewPassword}>
      {/* Heading */}
      <h2 className="text-center text-4xl font-semibold text-gray-900">
        Change Password
      </h2>
      <p className="mt-1 text-center text-base text-gray-600">
        Please enter a new password
      </p>

      {/* Password Input */}
      <div className="mt-8">
        <label
          htmlFor="newPassword"
          className="block text-base font-medium text-gray-700"
        >
          New Password
        </label>
        <input
          onChange={(e) => setNewPassword(e.target.value)}
          value={newPassword}
          type="password"
          id="newPassword"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="••••••••"
        />
      </div>

      {/* Confirm Password Input */}
      <div className="mt-8">
        <label
          htmlFor="confirmPassword"
          className="block text-base font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <input
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          type="password"
          id="confirmPassword"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="••••••••"
        />
      </div>

      {/* Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-40 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Please wait…" : "Change Password"}
        </button>
      </div>
    </form>
  );
};

export default ChangePassword;
