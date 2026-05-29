import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResource } from "../resources/resourceSlice";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const reservedStatuses = ["pending", "confirmed"];
const occupiedStatuses = ["checked_in", "checked_out"];
const blockingStatuses = ["pending", "confirmed", "checked_in"];

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeDate(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function isSameDay(firstDate, secondDate) {
  return getDateKey(firstDate) === getDateKey(secondDate);
}

function isDateInBooking(date, booking) {
  const checkIn = normalizeDate(booking.checkIn);
  const checkOut = normalizeDate(booking.checkOut);
  return date >= checkIn && date <= checkOut;
}

function getBookingDateStatus(date, bookings) {
  if (!date) {
    return "empty";
  }

  const dateBookings = bookings.filter((booking) => booking.status !== "cancelled" && isDateInBooking(date, booking));

  if (dateBookings.some((booking) => occupiedStatuses.includes(booking.status))) {
    return "occupied";
  }

  if (dateBookings.some((booking) => reservedStatuses.includes(booking.status || "pending"))) {
    return "reserved";
  }

  return "available";
}

export function AdminCalendarPage() {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.resources.bookings);
  const cabins = useSelector((state) => state.resources.cabins);
  const campsites = useSelector((state) => state.resources.campsites);
  const status = useSelector((state) => state.resources.status.bookings || "idle");
  const [selectedAccommodationId, setSelectedAccommodationId] = useState("all");
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  useEffect(() => {
    dispatch(fetchResource("bookings"));
    dispatch(fetchResource("cabins"));
    dispatch(fetchResource("campsites"));
  }, [dispatch]);

  const accommodations = useMemo(
    () => [
      ...cabins.map((item) => ({ ...item, type: "Cabin", price: item.pricePerDay, rateLabel: "per day" })),
      ...campsites.map((item) => ({ ...item, type: "Campsite", price: item.pricePerPerson, rateLabel: "per person" }))
    ],
    [cabins, campsites]
  );

  const selectedAccommodation = accommodations.find((item) => Number(item.id) === Number(selectedAccommodationId));
  const selectedBookings = useMemo(
    () => (
      selectedAccommodationId === "all"
        ? bookings
        : bookings.filter((booking) => Number(booking.accommodationId) === Number(selectedAccommodationId))
    ),
    [bookings, selectedAccommodationId]
  );

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const leadingDays = firstDay.getDay();
    const days = [];

    for (let index = 0; index < leadingDays; index += 1) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      days.push(new Date(year, month, day));
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  }, [visibleMonth]);

  const getAccommodationStatus = (accommodationId) => {
    const today = normalizeDate(new Date());
    const isOccupied = bookings.some(
      (booking) => (
        Number(booking.accommodationId) === Number(accommodationId)
        && blockingStatuses.includes(booking.status || "pending")
        && isDateInBooking(today, booking)
      )
    );

    return isOccupied ? "occupied" : "available";
  };

  const monthLabel = visibleMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const moveMonth = (direction) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  };

  const getBookingForDate = (date) => {
    if (!date) {
      return null;
    }

    return selectedBookings.find((booking) => booking.status !== "cancelled" && isDateInBooking(date, booking)) || null;
  };

  const handleCalendarDayClick = (date) => {
    const booking = getBookingForDate(date);
    if (booking?.accommodationId) {
      setSelectedAccommodationId(Number(booking.accommodationId));
    } else {
      setSelectedAccommodationId("all");
    }
  };

  useEffect(() => {
    const handleDocumentPointerDown = (event) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const interactiveElement = event.target.closest("a, button, input, select, textarea, [role='button']");
      if (!interactiveElement) {
        setSelectedAccommodationId("all");
      }
    };

    document.addEventListener("pointerdown", handleDocumentPointerDown);
    return () => document.removeEventListener("pointerdown", handleDocumentPointerDown);
  }, []);

  return (
    <section className="page admin-calendar-page">
      <div className="page-header">
        <div>
          <h1>Calendar</h1>
          <p>Month view of confirmed stays and active booking dates.</p>
        </div>
        <button className="icon-button" type="button" title="Refresh" onClick={() => dispatch(fetchResource("bookings"))}>
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="admin-calendar-layout">
        <div className="admin-calendar-panel">
          <div className="admin-calendar-head">
            <button className="icon-button" type="button" title="Previous month" onClick={() => moveMonth(-1)}>
              <ChevronLeft size={18} />
            </button>
            <div>
              <strong>{monthLabel}</strong>
              <span>{selectedAccommodation ? `${selectedAccommodation.type} ${selectedAccommodation.identifier}` : "All accommodations"}</span>
            </div>
            <button className="icon-button" type="button" title="Next month" onClick={() => moveMonth(1)}>
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="admin-calendar-legend">
            <span className="available">Free</span>
            <span className="reserved">Reserved</span>
            <span className="occupied">Occupied</span>
          </div>

          <div className="admin-calendar-grid">
            {weekdayLabels.map((day) => (
              <div className="admin-calendar-weekday" key={day}>{day}</div>
            ))}
            {calendarDays.map((date, index) => {
              const dateStatus = getBookingDateStatus(date, selectedBookings);
              const dayBooking = getBookingForDate(date);
              return (
                <article
                  className={`admin-calendar-day ${dateStatus} ${date && isSameDay(date, new Date()) ? "today" : ""}`}
                  key={date ? getDateKey(date) : `empty-${index}`}
                  role={dayBooking ? "button" : undefined}
                  tabIndex={dayBooking ? 0 : undefined}
                  onClick={() => handleCalendarDayClick(date)}
                  onKeyDown={(event) => {
                    if (dayBooking && (event.key === "Enter" || event.key === " ")) {
                      event.preventDefault();
                      handleCalendarDayClick(date);
                    }
                  }}
                >
                  {date ? (
                  <>
                    <span>{date.getDate()}</span>
                  </>
                ) : null}
              </article>
              );
            })}
          </div>
        </div>

        <aside className="admin-accommodation-list">
          <div className="admin-card-head">
            <span>Accommodations</span>
          </div>

          <div className="admin-accommodation-items">
            <button
              className={`admin-accommodation-item ${selectedAccommodationId === "all" ? "active" : ""}`}
              type="button"
              onClick={() => setSelectedAccommodationId("all")}
            >
              <div>
                <strong>All accommodations</strong>
                <span>Combined booking status</span>
              </div>
            </button>
            {accommodations.map((accommodation) => {
              const accommodationStatus = getAccommodationStatus(accommodation.id);
              return (
                <button
                  className={`admin-accommodation-item ${Number(selectedAccommodationId) === Number(accommodation.id) ? "active" : ""}`}
                  type="button"
                  key={`${accommodation.type}-${accommodation.id}`}
                  onClick={() => setSelectedAccommodationId(accommodation.id)}
                >
                  <div>
                    <strong>{accommodation.type} {accommodation.identifier}</strong>
                    <span>{accommodation.maxCapacity} guests - ${accommodation.price} {accommodation.rateLabel}</span>
                  </div>
                  <small className={`accommodation-status ${accommodationStatus}`}>
                    {accommodationStatus === "occupied" ? "Occupied" : "Available"}
                  </small>
                </button>
              );
            })}
            {accommodations.length === 0 ? <p className="state-text">No accommodations loaded.</p> : null}
          </div>
        </aside>
      </div>

      {status === "loading" ? <p className="state-text">Loading calendar...</p> : null}
    </section>
  );
}
