import { useEffect, useMemo, useState } from "react";
import { CalendarPlus, RefreshCw, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createResource, deleteResource, fetchResource, updateBookingStatus } from "../resources/resourceSlice";

const bookingStatuses = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "checked_in", label: "Checked in" },
  { value: "checked_out", label: "Checked out" },
  { value: "cancelled", label: "Cancelled" }
];

function formatBookingStatus(status = "pending") {
  return bookingStatuses.find((item) => item.value === status)?.label || "Pending";
}

function getDateKey(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function BookingsPage() {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.resources.bookings);
  const cabins = useSelector((state) => state.resources.cabins);
  const campsites = useSelector((state) => state.resources.campsites);
  const status = useSelector((state) => state.resources.status.bookings || "idle");
  const error = useSelector((state) => state.resources.errors.bookings);
  const [form, setForm] = useState({
    checkIn: "",
    checkOut: "",
    amountOfPeople: 1,
    firstName: "",
    lastName: "",
    document: "",
    accommodationId: ""
  });
  const [filters, setFilters] = useState({
    status: "all",
    holder: "",
    accommodationId: "all",
    date: ""
  });

  const accommodations = useMemo(
    () => [
      ...cabins.map((item) => ({ ...item, type: "Cabin" })),
      ...campsites.map((item) => ({ ...item, type: "Campsite" }))
    ],
    [cabins, campsites]
  );

  const filteredBookings = useMemo(() => bookings.filter((booking) => {
    const holderName = booking.Guest ? `${booking.Guest.firstName} ${booking.Guest.lastName}`.toLowerCase() : "";
    const bookingStatus = booking.status || "pending";
    const matchesStatus = filters.status === "all" || bookingStatus === filters.status;
    const matchesHolder = !filters.holder.trim() || holderName.includes(filters.holder.trim().toLowerCase());
    const matchesAccommodation = filters.accommodationId === "all" || Number(booking.accommodationId) === Number(filters.accommodationId);
    const matchesDate = !filters.date || getDateKey(booking.checkIn) === filters.date || getDateKey(booking.checkOut) === filters.date;

    return matchesStatus && matchesHolder && matchesAccommodation && matchesDate;
  }), [bookings, filters]);

  useEffect(() => {
    dispatch(fetchResource("bookings"));
    dispatch(fetchResource("cabins"));
    dispatch(fetchResource("campsites"));
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "number" ? Number(value) : value }));
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: "all", holder: "", accommodationId: "all", date: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(createResource({ resource: "bookings", values: form }));
    if (createResource.fulfilled.match(result)) {
      setForm({ checkIn: "", checkOut: "", amountOfPeople: 1, firstName: "", lastName: "", document: "", accommodationId: "" });
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Bookings</h1>
          <p>Create bookings and move each stay through its status flow.</p>
        </div>
        <button className="icon-button" type="button" title="Refresh" onClick={() => dispatch(fetchResource("bookings"))}>
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="work-grid">
        <form className="panel form compact-form" onSubmit={handleSubmit}>
          <h2>New booking</h2>
          <label>
            Holder first name
            <input name="firstName" value={form.firstName} onChange={handleChange} required />
          </label>
          <label>
            Holder last name
            <input name="lastName" value={form.lastName} onChange={handleChange} required />
          </label>
          <label>
            Holder document
            <input name="document" value={form.document} onChange={handleChange} required />
          </label>
          <label>
            Check-in
            <input name="checkIn" type="date" value={form.checkIn} onChange={handleChange} required />
          </label>
          <label>
            Check-out
            <input name="checkOut" type="date" value={form.checkOut} onChange={handleChange} required />
          </label>
          <label>
            Guests
            <input name="amountOfPeople" type="number" min="1" value={form.amountOfPeople} onChange={handleChange} required />
          </label>
          <label>
            Accommodation
            <select name="accommodationId" value={form.accommodationId} onChange={handleChange} required>
              <option value="">Select</option>
              {accommodations.map((item) => (
                <option key={`${item.type}-${item.id}`} value={item.id}>
                  {item.type} {item.identifier}
                </option>
              ))}
            </select>
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button className="primary-button" type="submit">
            <CalendarPlus size={18} />
            Create
          </button>
        </form>

        <div className="bookings-list-panel">
          <div className="booking-filters">
            <label>
              Status
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="all">All statuses</option>
                {bookingStatuses.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>
            <label>
              Holder
              <input name="holder" value={filters.holder} onChange={handleFilterChange} placeholder="Search by name" />
            </label>
            <label>
              Accommodation
              <select name="accommodationId" value={filters.accommodationId} onChange={handleFilterChange}>
                <option value="all">All accommodations</option>
                {accommodations.map((item) => (
                  <option key={`${item.type}-${item.id}`} value={item.id}>
                    {item.type} {item.identifier}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Date
              <input name="date" type="date" value={filters.date} onChange={handleFilterChange} />
            </label>
            <button className="secondary-button" type="button" onClick={clearFilters}>Clear</button>
          </div>

          <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Holder</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Guests</th>
                <th>Total</th>
                <th>Status</th>
                <th>Flow</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.Guest ? `${booking.Guest.firstName} ${booking.Guest.lastName}` : "-"}</td>
                  <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                  <td>{booking.amountOfPeople}</td>
                  <td>${booking.totalAmount}</td>
                  <td>
                    <span className={`booking-status-badge ${booking.status || "pending"}`}>
                      {formatBookingStatus(booking.status)}
                    </span>
                  </td>
                  <td>
                    <select
                      className="booking-status-select"
                      value={booking.status || "pending"}
                      onChange={(event) => dispatch(updateBookingStatus({ id: booking.id, status: event.target.value }))}
                    >
                      {bookingStatuses.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="icon-button danger"
                      type="button"
                      title="Delete"
                      onClick={() => dispatch(deleteResource({ resource: "bookings", id: booking.id }))}
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {status === "loading" ? <p className="state-text">Loading...</p> : null}
          {status !== "loading" && bookings.length === 0 ? <p className="state-text">No bookings have been added.</p> : null}
          {status !== "loading" && bookings.length > 0 && filteredBookings.length === 0 ? <p className="state-text">No bookings match these filters.</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
