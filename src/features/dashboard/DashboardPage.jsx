import { useEffect } from "react";
import { BedDouble, CalendarDays, Tent } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResource } from "../resources/resourceSlice";

const cards = [
  { key: "cabins", label: "Cabins", icon: BedDouble },
  { key: "campsites", label: "Campsites", icon: Tent },
  { key: "bookings", label: "Bookings", icon: CalendarDays }
];

export function DashboardPage() {
  const dispatch = useDispatch();
  const resources = useSelector((state) => state.resources);

  useEffect(() => {
    cards.forEach((card) => dispatch(fetchResource(card.key)));
  }, [dispatch]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingBookings = [...resources.bookings]
    .filter((booking) => new Date(booking.checkIn) >= today)
    .sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn))
    .slice(0, 5);
  const accommodationStatus = [
    ...resources.cabins.map((item) => ({ ...item, type: "Cabin", price: item.pricePerDay, rateLabel: "per day" })),
    ...resources.campsites.map((item) => ({ ...item, type: "Campsite", price: item.pricePerPerson, rateLabel: "per person" }))
  ].slice(0, 6);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Summary</h1>
          <p>Welcome back. Quick overview of the campground operation.</p>
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

      <div className="admin-two-col">
        <article className="admin-card">
          <div className="admin-card-head">
            <span>Upcoming bookings</span>
          </div>
          <div className="admin-list">
            {upcomingBookings.map((booking) => (
              <div className="admin-list-row" key={booking.id}>
                <div>
                  <strong>{new Date(booking.checkIn).toLocaleDateString()}</strong>
                  <span>{new Date(booking.checkOut).toLocaleDateString()} checkout</span>
                </div>
                <div>
                  <strong>{booking.amountOfPeople} guests</strong>
                  <span>${booking.totalAmount}</span>
                </div>
              </div>
            ))}
            {upcomingBookings.length === 0 ? <p className="state-text">No upcoming bookings.</p> : null}
          </div>
        </article>

        <article className="admin-card">
          <div className="admin-card-head">
            <span>Accommodation status</span>
          </div>
          <div className="admin-list">
            {accommodationStatus.map((item) => (
              <div className="admin-list-row" key={`${item.type}-${item.id}`}>
                <div>
                  <strong>{item.type} {item.identifier}</strong>
                  <span>{item.maxCapacity} guests</span>
                </div>
                <div>
                  <strong>${item.price}</strong>
                  <span>{item.rateLabel}</span>
                </div>
              </div>
            ))}
            {accommodationStatus.length === 0 ? <p className="state-text">No accommodations loaded.</p> : null}
          </div>
        </article>
      </div>
    </section>
  );
}
