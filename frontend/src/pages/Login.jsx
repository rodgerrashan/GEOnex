import React, { useState, useContext } from "react";
import { Context } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { navigate, backendUrl, setIsLoggedin, getUserData } =
    useContext(Context);

  const [state, setState] = useState("Log In");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // prevent double-clicks / rapid re-submits
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        /* create the user */
        const { data: signRes } = await axios.post(
          backendUrl + "/api/auth/register",
          {
            name,
            email,
            password,
          }
        );

        if (!signRes.success) {
          toast.error(signRes.message);
          return;
        }

        /* ask server to generate & send OTP */
        const { data: otpRes } = await axios.get(
          `${backendUrl}/api/auth/sendverifyotp`,
          { withCredentials: true }
        );

        if (otpRes.success) {
          toast.success("Registered! We've emailed an OTP for verification.");
          navigate("/email-verify");
        } else {
          toast.error(otpRes.message || "Failed to send verification OTP.");
        }
      } else {
        /* Log-in branch */
        const { data: loginRes } = await axios.post(
          backendUrl + "/api/auth/login",
          {
            email,
            password,
          }
        );

        if (loginRes.success) {
          setIsLoggedin(true);
          await getUserData();
          navigate("/dashboard");
        } else {
          toast.error(loginRes.message);
          if (loginRes.message === "Please verify your account first.") {
            navigate("/email-verify");
          }
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
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
        <h1 onClick={() => navigate("/")}
        className="text-center text-3xl font-light text-gray-900 cursor-pointer">
          <span className="font-semibold">GEO</span>nex
        </h1>

        {/* Welcome text */}
        <h2 className="mt-4 text-center text-4xl font-semibold text-gray-900">
          {state === "Log In" ? "Welcome Back" : "Welcome"}
        </h2>
        <p className="mt-1 text-center text-base text-gray-600">
          {state === "Log In"
            ? "Please enter your details to login"
            : "Create a new account"}
        </p>

        {/* Form */}
        <form onSubmit={onSubmitHandler} className="mt-8 space-y-5">
          {/* Full Name */}
          {state === "Sign Up" && (
            <div>
              <label
                htmlFor="name"
                className="block text-base font-medium text-gray-700"
              >
                Your Full Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                id="name"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Full Name"
              />
            </div>
          )}

          {/* Email */}
          <div>
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

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-base font-medium text-gray-700"
            >
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              id="password"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="••••••••"
            />

            {state === "Log In" && (
              <div className="mt-1 text-right">
                <p
                  onClick={() => navigate("/reset-password")}
                  className="text-sm font-medium text-indigo-600 hover:underline cursor-pointer mt-2"
                >
                  Forgot password?
                </p>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-gray-900 py-2 text-base font-medium text-white hover:bg-gray-800 transition"
          >
            {isSubmitting ? "Please wait…" : state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <span
              onClick={() => setState("Log In")}
              className="font-medium text-indigo-600 hover:underline cursor-pointer"
            >
              Log in
            </span>
          </p>
        ) : (
          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t you have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="font-medium text-indigo-600 hover:underline cursor-pointer"
            >
              Sign up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
