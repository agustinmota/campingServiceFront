import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { SESSION_EXPIRED_EVENT } from "./authToken";

export function SessionWatcher() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleSessionExpired = () => {
      dispatch(logout());
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, [dispatch]);

  return null;
}
