import { describe, expect, it } from "vitest";
import { filterBookings } from "./bookingFilters";

const bookings = [
  {
    id: 1,
    status: "confirmed",
    accommodationId: 10,
    checkIn: "2026-06-01",
    checkOut: "2026-06-05",
    Guest: { firstName: "Ana", lastName: "Stone" }
  },
  {
    id: 2,
    status: "cancelled",
    accommodationId: 11,
    checkIn: "2026-07-10",
    checkOut: "2026-07-12",
    Guest: { firstName: "Leo", lastName: "River" }
  }
];

describe("filterBookings", () => {
  it("filters bookings by status, holder, accommodation, and date inside the stay", () => {
    const result = filterBookings(bookings, {
      status: "confirmed",
      holder: "ana",
      accommodationId: "10",
      date: "2026-06-03"
    });

    expect(result).toEqual([bookings[0]]);
  });

  it("returns no bookings when the selected date is outside the stay", () => {
    const result = filterBookings(bookings, {
      status: "all",
      holder: "",
      accommodationId: "all",
      date: "2026-06-09"
    });

    expect(result).toEqual([]);
  });
});
