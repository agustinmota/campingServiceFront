import { Link } from "react-router-dom";
import { BedDouble, CalendarDays, LogIn, Tent, UserPlus, Waves } from "lucide-react";

export function PublicHomePage() {
  return (
    <main className="public-page">
      <header className="public-nav">
        <div className="brand public-brand">
          <Waves size={28} />
          <strong>Camping Service</strong>
        </div>
        <nav>
          <Link className="secondary-button" to="/register">
            <UserPlus size={18} />
            Crear usuario
          </Link>
          <Link className="primary-button" to="/login">
            <LogIn size={18} />
            Ingresar
          </Link>
        </nav>
      </header>

      <section className="public-hero">
        <div>
          <h1>Camping Service</h1>
          <p>Consulta alojamientos, entra con tu usuario o gestiona el camping como administrador.</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/login">
              <LogIn size={18} />
              Entrar
            </Link>
            <Link className="secondary-button" to="/register">
              <UserPlus size={18} />
              Crear usuario
            </Link>
          </div>
        </div>
      </section>

      <section className="public-strip">
        <article>
          <BedDouble size={22} />
          <strong>Cabanas</strong>
          <span>Alojamientos con precio por dia.</span>
        </article>
        <article>
          <Tent size={22} />
          <strong>Parcelas</strong>
          <span>Espacios con tarifa por persona.</span>
        </article>
        <article>
          <CalendarDays size={22} />
          <strong>Reservas</strong>
          <span>Gestion interna para administradores.</span>
        </article>
      </section>
    </main>
  );
}
