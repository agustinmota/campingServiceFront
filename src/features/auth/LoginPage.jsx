import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ShieldCheck, LockKeyhole, Mail, Waves } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectAuthToken } from "./authSlice";

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(selectAuthToken);
  const status = useSelector((state) => state.auth.status);
  const error = useSelector((state) => state.auth.error);
  const [form, setForm] = useState({ email: "", password: "" });
  const [roleError, setRoleError] = useState(null);

  if (token) {
    return <Navigate to="/app" replace />;
  }

  const handleChange = (event) => {
    setRoleError(null);
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setRoleError(null);
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      navigate("/app");
    }
  };

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    setRoleError(null);
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      if (result.payload.user?.role === "admin") {
        navigate("/app/dashboard");
      } else {
        dispatch(logout());
        setRoleError("Esta cuenta no tiene permisos de administrador.");
      }
    }
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-brand">
          <Waves size={36} />
          <div>
            <h1>Camping Service</h1>
            <p>Gestion de alojamientos y reservas</p>
          </div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Email
            <span className="input-shell">
              <Mail size={18} />
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </span>
          </label>

          <label>
            Password
            <span className="input-shell">
              <LockKeyhole size={18} />
              <input name="password" type="password" value={form.password} onChange={handleChange} required />
            </span>
          </label>

          {error || roleError ? <p className="error">{roleError || error}</p> : null}

          <button className="primary-button" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Entrando..." : "Entrar"}
          </button>
          <button className="secondary-button" type="button" onClick={handleAdminLogin} disabled={status === "loading"}>
            <ShieldCheck size={18} />
            Entrar como admin
          </button>
          <Link className="text-link" to="/register">Crear usuario</Link>
        </form>
      </section>
    </main>
  );
}
