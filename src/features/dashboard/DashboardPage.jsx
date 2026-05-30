import { useEffect } from "react";
import { BedDouble, CalendarDays, CircleDollarSign, Percent, Tent, UsersRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResource } from "../resources/resourceSlice";
import { buildAdminAccommodations } from "../../shared/accommodationUtils";
import { bookingStatuses, formatBookingStatus } from "../../shared/bookingStatus";
import { formatDate, isSameMonth, normalizeDate } from "../../shared/dateUtils";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const cards = [
  { key: "cabins", label: "Cabins", icon: BedDouble },
  { key: "campsites", label: "Campsites", icon: Tent },
  { key: "bookings", label: "Bookings", icon: CalendarDays }
];

function getOverlappingNights(booking, rangeStart, rangeEnd) {
  const checkIn = normalizeDate(booking.checkIn);
  const checkOut = normalizeDate(booking.checkOut);
  const start = checkIn > rangeStart ? checkIn : rangeStart;
  const end = checkOut < rangeEnd ? checkOut : rangeEnd;
  return Math.max(0, Math.ceil((end - start) / MS_PER_DAY));
}

export function DashboardPage() {
  const dispatch = useDispatch();
  const resources = useSelector((state) => state.resources);

  useEffect(() => {
    cards.forEach((card) => dispatch(fetchResource(card.key)));
  }, [dispatch]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const daysInMonth = Math.ceil((nextMonthStart - monthStart) / MS_PER_DAY);
  const accommodations = buildAdminAccommodations(resources.cabins, resources.campsites);
  const accommodationById = new Map(accommodations.map((item) => [Number(item.id), item]));
  const getAccommodationLabel = (booking) => {
    const accommodation = accommodationById.get(Number(booking.accommodationId));
    return accommodation ? `${accommodation.type} ${accommodation.identifier}` : `${booking.amountOfPeople} guests`;
  };
  const activeBookings = resources.bookings.filter((booking) => booking.status !== "cancelled");
  const monthlyBookings = activeBookings.filter((booking) => isSameMonth(normalizeDate(booking.checkIn), monthStart));
  const monthlyRevenue = monthlyBookings.reduce((total, booking) => total + Number(booking.totalAmount || 0), 0);
  const totalRevenue = activeBookings.reduce((total, booking) => total + Number(booking.totalAmount || 0), 0);
  const monthlyGuests = monthlyBookings.reduce((total, booking) => total + Number(booking.amountOfPeople || 0), 0);
  const bookedNights = activeBookings.reduce(
    (total, booking) => total + getOverlappingNights(booking, monthStart, nextMonthStart),
    0
  );
  const availableNights = Math.max(1, accommodations.length * daysInMonth);
  const occupancyRate = accommodations.length > 0 ? Math.min(100, Math.round((bookedNights / availableNights) * 100)) : 0;
  const statusBreakdown = bookingStatuses.map((statusItem) => {
    const count = resources.bookings.filter((booking) => (booking.status || "pending") === statusItem.value).length;
    const percentage = resources.bookings.length ? Math.round((count / resources.bookings.length) * 100) : 0;
    return { ...statusItem, count, percentage };
  });
  const accommodationAnalytics = accommodations
    .map((accommodation) => {
      const accommodationBookings = activeBookings.filter((booking) => Number(booking.accommodationId) === Number(accommodation.id));
      const revenue = accommodationBookings.reduce((total, booking) => total + Number(booking.totalAmount || 0), 0);
      return { ...accommodation, bookings: accommodationBookings.length, revenue };
    })
    .filter((item) => item.bookings > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const upcomingBookings = [...resources.bookings]
    .filter((booking) => booking.status !== "cancelled" && normalizeDate(booking.checkIn) >= today)
    .sort((a, b) => normalizeDate(a.checkIn) - normalizeDate(b.checkIn))
    .slice(0, 5);
  const accommodationStatus = accommodations.slice(0, 6);

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
        <article className="stat-card">
          <CircleDollarSign size={24} />
          <span>Monthly revenue</span>
          <strong>${monthlyRevenue}</strong>
        </article>
      </div>

      <div className="analytics-grid">
        <article className="analytics-card featured">
          <div className="analytics-card-head">
            <div>
              <span>Current month occupancy</span>
              <strong>{occupancyRate}%</strong>
            </div>
            <Percent size={22} />
          </div>
          <div className="analytics-meter">
            <span style={{ width: `${occupancyRate}%` }} />
          </div>
          <p>{bookedNights} booked nights from {availableNights} available accommodation nights.</p>
        </article>

        <article className="analytics-card">
          <div className="analytics-card-head">
            <div>
              <span>Guests this month</span>
              <strong>{monthlyGuests}</strong>
            </div>
            <UsersRound size={22} />
          </div>
          <p>{monthlyBookings.length} active bookings started during this month.</p>
        </article>

        <article className="analytics-card">
          <div className="analytics-card-head">
            <div>
              <span>Total projected revenue</span>
              <strong>${totalRevenue}</strong>
            </div>
            <CircleDollarSign size={22} />
          </div>
          <p>Revenue excludes cancelled bookings and includes pending/confirmed stays.</p>
        </article>
      </div>

      <div className="admin-two-col analytics-two-col">
        <article className="admin-card">
          <div className="admin-card-head">
            <span>Booking status breakdown</span>
          </div>
          <div className="analytics-bars">
            {statusBreakdown.map((item) => (
              <div className="analytics-bar-row" key={item.value}>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.count} bookings</span>
                </div>
                <div className="analytics-bar-track">
                  <span className={item.value} style={{ width: `${item.percentage}%` }} />
                </div>
                <em>{item.percentage}%</em>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-card">
          <div className="admin-card-head">
            <span>Top accommodations</span>
          </div>
          <div className="admin-list">
            {accommodationAnalytics.map((item) => (
              <div className="admin-list-row" key={`${item.type}-${item.id}`}>
                <div>
                  <strong>{item.type} {item.identifier}</strong>
                  <span>{item.bookings} bookings</span>
                </div>
                <div>
                  <strong>${item.revenue}</strong>
                  <span>projected revenue</span>
                </div>
              </div>
            ))}
            {accommodationAnalytics.length === 0 ? <p className="state-text">No booking revenue yet.</p> : null}
          </div>
        </article>
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
                  <strong>{formatDate(booking.checkIn)}</strong>
                  <span>{formatDate(booking.checkOut)} checkout</span>
                </div>
                <div>
                  <strong>{getAccommodationLabel(booking)}</strong>
                  <span>${booking.totalAmount} - {formatBookingStatus(booking.status)}</span>
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
