import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../features/auth/authSlice";

export function AppIndexRedirect() {
  const user = useSelector(selectAuthUser);
  return <Navigate to={user?.role === "admin" ? "/app/dashboard" : "/"} replace />;
}
