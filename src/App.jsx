import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { BedDouble, CalendarDays, Grid2X2, LayoutDashboard, LogOut, Tent } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectAuthUser } from "./features/auth/authSlice";

const navItems = [
  { to: "/app/dashboard", label: "Summary", icon: LayoutDashboard, roles: ["admin"], group: "Main" },
  { to: "/app/bookings", label: "Bookings", icon: CalendarDays, roles: ["admin"], group: "Main" },
  { to: "/app/calendar", label: "Calendar", icon: Grid2X2, roles: ["admin"], group: "Main" },
  { to: "/app/cabins", label: "Cabins", icon: BedDouble, roles: ["admin", "user"], group: "Management" },
  { to: "/app/campsites", label: "Campsites", icon: Tent, roles: ["admin", "user"], group: "Management" }
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
  const groupedItems = visibleItems.reduce((groups, item) => {
    const groupName = item.group || "Menu";
    return { ...groups, [groupName]: [...(groups[groupName] || []), item] };
  }, {});
  const isAdmin = user?.role === "admin";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  return (
    <div className={`shell ${isAdmin ? "admin-shell" : ""}`}>
      <aside className="sidebar">
        <div className="brand">
          <img className="brand-logo" src="/img/HOTEL%20LOGO.png" alt="Camping Service logo" />
          <div>
            <span>{isAdmin ? "Administration Panel" : "Guest Area"}</span>
            <strong>Refugio<br />del <em>Lago</em></strong>
          </div>
        </div>

        <nav className="nav">
          {Object.entries(groupedItems).map(([groupName, items]) => (
            <div className="nav-group" key={groupName}>
              {isAdmin ? <p className="admin-nav-label">{groupName}</p> : null}
              {items.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? "active" : "")}>
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer-panel">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{isAdmin ? "ADM" : "USR"}</div>
            <div>
              <strong>{user?.username || user?.email || "Account"}</strong>
              <span>{isAdmin ? "Administrator" : "Guest user"}</span>
            </div>
          </div>

          <button className="ghost-button" type="button" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="content">
        {isAdmin ? (
          <div className="admin-topbar">
            <div>
              <strong>Refugio del Lago</strong>
              <span>Management panel</span>
            </div>
            <div>
              <span>{today}</span>
              <Link to="/">View site</Link>
            </div>
          </div>
        ) : null}
        <Outlet />
      </main>
    </div>
  );
}
