import { Trash2 } from "lucide-react";
import { bookingStatuses, formatBookingStatus } from "../../../shared/bookingStatus";
import { formatDate } from "../../../shared/dateUtils";

export function BookingTable({ bookings, allBookingsCount, status, onDelete, onStatusChange }) {
  return (
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
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.Guest ? `${booking.Guest.firstName} ${booking.Guest.lastName}` : "-"}</td>
              <td>{formatDate(booking.checkIn)}</td>
              <td>{formatDate(booking.checkOut)}</td>
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
                  onChange={(event) => onStatusChange(booking.id, event.target.value)}
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
                  onClick={() => onDelete(booking.id)}
                >
                  <Trash2 size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {status === "loading" ? <p className="state-text">Loading...</p> : null}
      {status !== "loading" && allBookingsCount === 0 ? <p className="state-text">No bookings have been added.</p> : null}
      {status !== "loading" && allBookingsCount > 0 && bookings.length === 0 ? <p className="state-text">No bookings match these filters.</p> : null}
    </div>
  );
}
