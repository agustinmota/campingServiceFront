import { useEffect } from "react";
import { BedDouble, CalendarDays, Tent, UsersRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResource } from "../resources/resourceSlice";

const cards = [
  { key: "cabins", label: "Cabanas", icon: BedDouble },
  { key: "campsites", label: "Parcelas", icon: Tent },
  { key: "guests", label: "Huespedes", icon: UsersRound },
  { key: "bookings", label: "Reservas", icon: CalendarDays }
];

export function DashboardPage() {
  const dispatch = useDispatch();
  const resources = useSelector((state) => state.resources);

  useEffect(() => {
    cards.forEach((card) => dispatch(fetchResource(card.key)));
  }, [dispatch]);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Panel de gestion</h1>
          <p>Vista rapida del estado operativo del camping.</p>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map(({ key, label, icon: Icon }) => (
          <article className="stat-card" key={key}>
            <Icon size={24} />
            <span>{label}</span>
            <strong>{resources[key].length}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
