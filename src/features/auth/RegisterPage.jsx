import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, User, UserPlus, Waves } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "./authSlice";

export function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector((state) => state.auth.status);
  const error = useSelector((state) => state.auth.error);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-brand">
          <Waves size={36} />
          <div>
            <h1>Crear usuario</h1>
            <p>Cuenta de acceso general</p>
          </div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Usuario
            <span className="input-shell">
              <User size={18} />
              <input name="username" value={form.username} onChange={handleChange} required />
            </span>
          </label>

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

          {error ? <p className="error">{error}</p> : null}

          <button className="primary-button" type="submit" disabled={status === "loading"}>
            <UserPlus size={18} />
            {status === "loading" ? "Creando..." : "Crear usuario"}
          </button>
          <Link className="text-link" to="/login">Ya tengo cuenta</Link>
        </form>
      </section>
    </main>
  );
}
