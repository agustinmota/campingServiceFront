import { bookingStatuses } from "../../../shared/bookingStatus";

export function BookingFilters({ accommodations, filters, onChange, onClear }) {
  return (
    <div className="booking-filters">
      <label>
        Status
        <select name="status" value={filters.status} onChange={onChange}>
          <option value="all">All statuses</option>
          {bookingStatuses.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </label>
      <label>
        Holder
        <input name="holder" value={filters.holder} onChange={onChange} placeholder="Search by name" />
      </label>
      <label>
        Accommodation
        <select name="accommodationId" value={filters.accommodationId} onChange={onChange}>
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
        <input name="date" type="date" value={filters.date} onChange={onChange} />
      </label>
      <button className="secondary-button" type="button" onClick={onClear}>Clear</button>
    </div>
  );
}
