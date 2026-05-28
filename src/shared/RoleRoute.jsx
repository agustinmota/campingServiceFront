import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../features/auth/authSlice";

export function RoleRoute({ children, roles }) {
  const user = useSelector(selectAuthUser);
  return roles.includes(user?.role) ? children : <Navigate to="/app" replace />;
}
