import React, { useState } from 'react';

const Login = () => {

  const [state, setState] = useState('Log In')
  
  return (
    <div
      className="min-h-dvh flex items-center justify-center
      sm:bg-[rgba(47,47,48,1)]"  
    >
      <div className=" w-full min-h-dvh
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
          Welcome Back
        </h2>
        <p className="mt-1 text-center text-base text-gray-600">
          Please enter your details to login
        </p>

        {/* Form */}
        <form className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-base font-medium text-gray-700"
            >
              Your email address
            </label>
            <input
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
              type="password"
              id="password"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="••••••••"
            />
            <div className="mt-1 text-right">
              <a
                href="#"
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-md bg-gray-900 py-2 text-base font-medium text-white hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>

        {/* Sign-up helper */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t you have an account?{' '}
          <a href="#" className="font-medium text-indigo-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

