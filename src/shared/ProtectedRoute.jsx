import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthToken } from "../features/auth/authSlice";

export function ProtectedRoute({ children }) {
  const token = useSelector(selectAuthToken);
  const location = useLocation();
  return token ? children : <Navigate to="/login" replace state={{ from: location }} />;
}
