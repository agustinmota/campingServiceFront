import { normalizeDate } from "../../shared/dateUtils";

export const initialBookingForm = {
  checkIn: "",
  checkOut: "",
  amountOfPeople: 1,
  firstName: "",
  lastName: "",
  document: "",
  accommodationId: ""
};

export const initialBookingFilters = {
  status: "all",
  holder: "",
  accommodationId: "all",
  date: ""
};

function bookingIncludesDate(booking, dateValue) {
  if (!dateValue) {
    return true;
  }

  const selectedDate = normalizeDate(dateValue);
  const checkIn = normalizeDate(booking.checkIn);
  const checkOut = normalizeDate(booking.checkOut);
  return selectedDate >= checkIn && selectedDate <= checkOut;
}

export function filterBookings(bookings, filters) {
  return bookings.filter((booking) => {
    const holderName = booking.Guest ? `${booking.Guest.firstName} ${booking.Guest.lastName}`.toLowerCase() : "";
    const bookingStatus = booking.status || "pending";
    const matchesStatus = filters.status === "all" || bookingStatus === filters.status;
    const matchesHolder = !filters.holder.trim() || holderName.includes(filters.holder.trim().toLowerCase());
    const matchesAccommodation = filters.accommodationId === "all" || Number(booking.accommodationId) === Number(filters.accommodationId);
    const matchesDate = bookingIncludesDate(booking, filters.date);

    return matchesStatus && matchesHolder && matchesAccommodation && matchesDate;
  });
}
