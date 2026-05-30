export const bookingStatuses = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "checked_in", label: "Checked in" },
  { value: "checked_out", label: "Checked out" },
  { value: "cancelled", label: "Cancelled" }
];

export const reservedStatuses = ["pending", "confirmed"];
export const occupiedStatuses = ["checked_in", "checked_out"];
export const blockingStatuses = ["pending", "confirmed", "checked_in"];

export function formatBookingStatus(status = "pending") {
  return bookingStatuses.find((item) => item.value === status)?.label || "Pending";
}
