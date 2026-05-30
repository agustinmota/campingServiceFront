import { CalendarPlus } from "lucide-react";

export function BookingForm({ accommodations, error, form, onChange, onSubmit }) {
  return (
    <form className="panel form compact-form" onSubmit={onSubmit}>
      <h2>New booking</h2>
      <label>
        Holder first name
        <input name="firstName" value={form.firstName} onChange={onChange} required />
      </label>
      <label>
        Holder last name
        <input name="lastName" value={form.lastName} onChange={onChange} required />
      </label>
      <label>
        Holder document
        <input name="document" value={form.document} onChange={onChange} required />
      </label>
      <label>
        Check-in
        <input name="checkIn" type="date" value={form.checkIn} onChange={onChange} required />
      </label>
      <label>
        Check-out
        <input name="checkOut" type="date" value={form.checkOut} onChange={onChange} required />
      </label>
      <label>
        Guests
        <input name="amountOfPeople" type="number" min="1" value={form.amountOfPeople} onChange={onChange} required />
      </label>
      <label>
        Accommodation
        <select name="accommodationId" value={form.accommodationId} onChange={onChange} required>
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
  );
}
