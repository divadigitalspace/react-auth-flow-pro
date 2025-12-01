import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRouter = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
