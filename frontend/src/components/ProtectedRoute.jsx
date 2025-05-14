import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Context } from "../context/Context";
import Loading from "./Loading";

const ProtectedRoute = () => {
  const { isLoggedin, isLoading } = useContext(Context);

  if (isLoading) return <Loading />;

  return isLoggedin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
