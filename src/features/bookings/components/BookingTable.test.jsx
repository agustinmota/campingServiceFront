import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BookingTable } from "./BookingTable";

const booking = {
  id: 7,
  checkIn: "2026-06-01",
  checkOut: "2026-06-03",
  amountOfPeople: 2,
  totalAmount: 2400,
  status: "pending",
  Guest: { firstName: "Ana", lastName: "Stone" }
};

describe("BookingTable", () => {
  it("renders booking data and sends status updates", async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();

    render(
      <BookingTable
        allBookingsCount={1}
        bookings={[booking]}
        status="succeeded"
        onDelete={vi.fn()}
        onStatusChange={onStatusChange}
      />
    );

    expect(screen.getByText("Ana Stone")).toBeInTheDocument();
    expect(screen.getAllByText("Pending")).toHaveLength(2);

    await user.selectOptions(screen.getByDisplayValue("Pending"), "confirmed");

    expect(onStatusChange).toHaveBeenCalledWith(7, "confirmed");
  });

  it("sends delete actions", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <BookingTable
        allBookingsCount={1}
        bookings={[booking]}
        status="succeeded"
        onDelete={onDelete}
        onStatusChange={vi.fn()}
      />
    );

    await user.click(screen.getByTitle("Delete"));

    expect(onDelete).toHaveBeenCalledWith(7);
  });

  it("shows an empty state when filters hide all bookings", () => {
    render(
      <BookingTable
        allBookingsCount={2}
        bookings={[]}
        status="succeeded"
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
      />
    );

    expect(screen.getByText("No bookings match these filters.")).toBeInTheDocument();
  });
});
