import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createResource, deleteResource, fetchResource, updateBookingStatus } from "../resources/resourceSlice";
import { buildAdminAccommodations } from "../../shared/accommodationUtils";
import { filterBookings, initialBookingFilters, initialBookingForm } from "./bookingFilters";
import { BookingFilters } from "./components/BookingFilters";
import { BookingForm } from "./components/BookingForm";
import { BookingTable } from "./components/BookingTable";

export function BookingsPage() {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.resources.bookings);
  const cabins = useSelector((state) => state.resources.cabins);
  const campsites = useSelector((state) => state.resources.campsites);
  const status = useSelector((state) => state.resources.status.bookings || "idle");
  const error = useSelector((state) => state.resources.errors.bookings);
  const [form, setForm] = useState(initialBookingForm);
  const [filters, setFilters] = useState(initialBookingFilters);

  const accommodations = useMemo(
    () => buildAdminAccommodations(cabins, campsites),
    [cabins, campsites]
  );

  const filteredBookings = useMemo(() => filterBookings(bookings, filters), [bookings, filters]);

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
    setFilters(initialBookingFilters);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(createResource({ resource: "bookings", values: form }));
    if (createResource.fulfilled.match(result)) {
      setForm(initialBookingForm);
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
        <BookingForm accommodations={accommodations} error={error} form={form} onChange={handleChange} onSubmit={handleSubmit} />

        <div className="bookings-list-panel">
          <BookingFilters accommodations={accommodations} filters={filters} onChange={handleFilterChange} onClear={clearFilters} />
          <BookingTable
            allBookingsCount={bookings.length}
            bookings={filteredBookings}
            status={status}
            onDelete={(id) => dispatch(deleteResource({ resource: "bookings", id }))}
            onStatusChange={(id, nextStatus) => dispatch(updateBookingStatus({ id, status: nextStatus }))}
          />
        </div>
      </div>
    </section>
  );
}
