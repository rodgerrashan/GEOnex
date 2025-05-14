import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Context } from "../context/Context";
import Loading from "./Loading";

const ProtectedRoute = () => {
  const { isLoggedin, isLoading, userData } = useContext(Context);

  if (isLoading) return <Loading />;

  if (!isLoggedin) {
    return <Navigate to="/login" replace />;
  }

  if (userData && !userData.isAccountVerified) {
    return <Navigate to="/email-verify" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
