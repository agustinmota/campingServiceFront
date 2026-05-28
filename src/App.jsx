import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BedDouble, CalendarDays, Home, LogOut, Tent, UsersRound, Waves } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectAuthUser } from "./features/auth/authSlice";

const navItems = [
  { to: "/app", label: "Inicio", icon: Home, end: true, roles: ["admin", "user"] },
  { to: "/app/dashboard", label: "Panel", icon: Waves, roles: ["admin"] },
  { to: "/app/cabins", label: "Cabanas", icon: BedDouble, roles: ["admin", "user"] },
  { to: "/app/campsites", label: "Parcelas", icon: Tent, roles: ["admin", "user"] },
  { to: "/app/guests", label: "Huespedes", icon: UsersRound, roles: ["admin"] },
  { to: "/app/bookings", label: "Reservas", icon: CalendarDays, roles: ["admin"] }
];

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const visibleItems = navItems.filter((item) => item.roles.includes(user?.role || "user"));

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <Waves size={28} />
          <div>
            <strong>Camping Service</strong>
            <span>{user?.username || user?.email || user?.role}</span>
          </div>
        </div>

        <nav className="nav">
          {visibleItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? "active" : "")}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="ghost-button" type="button" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Salir</span>
        </button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
