import { useEffect, useMemo, useState } from "react";
import { CalendarPlus, RefreshCw, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createResource, deleteResource, fetchResource } from "../resources/resourceSlice";

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

  const accommodations = useMemo(
    () => [
      ...cabins.map((item) => ({ ...item, type: "Cabin" })),
      ...campsites.map((item) => ({ ...item, type: "Campsite" }))
    ],
    [cabins, campsites]
  );

  useEffect(() => {
    dispatch(fetchResource("bookings"));
    dispatch(fetchResource("cabins"));
    dispatch(fetchResource("campsites"));
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "number" ? Number(value) : value }));
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
          <p>Create and track confirmed stays.</p>
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

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Holder</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Guests</th>
                <th>Total</th>
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.Guest ? `${booking.Guest.firstName} ${booking.Guest.lastName}` : "-"}</td>
                  <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                  <td>{booking.amountOfPeople}</td>
                  <td>${booking.totalAmount}</td>
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
        </div>
      </div>
    </section>
  );
}
