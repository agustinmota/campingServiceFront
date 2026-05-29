import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CalendarPlus } from "lucide-react";
import { apiRequest } from "../../services/api";

export function ReservationPage() {
  const { id, type = "cabin" } = useParams();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    document: "",
    checkIn: "",
    checkOut: "",
    amountOfPeople: 1
  });

  useEffect(() => {
    async function loadCabin() {
      try {
        const data = await apiRequest(`/${type}/show/${id}`);
        setAccommodation(type === "campsite" ? data.campsite : data.cabin);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    loadCabin();
  }, [id, type]);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setError(null);
    setForm((current) => ({ ...current, [name]: type === "number" ? Number(value) : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      await apiRequest("/booking/create", {
        method: "POST",
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          document: form.document,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          amountOfPeople: form.amountOfPeople,
          accommodationId: Number(id)
        })
      });

      navigate("/app", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
      setStatus("failed");
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Book {type === "campsite" ? "campsite" : "cabin"} {accommodation?.identifier}</h1>
          <p>Complete your details to confirm the stay.</p>
        </div>
      </div>

      <div className="booking-home-grid">
        <form className="panel form compact-form" onSubmit={handleSubmit}>
          <h2>Booking details</h2>
          <label>
            First name
            <input name="firstName" value={form.firstName} onChange={handleChange} required />
          </label>
          <label>
            Last name
            <input name="lastName" value={form.lastName} onChange={handleChange} required />
          </label>
          <label>
            Document
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
            <input name="amountOfPeople" type="number" min="1" max={accommodation?.maxCapacity} value={form.amountOfPeople} onChange={handleChange} required />
          </label>

          {error ? <p className="error">{error}</p> : null}

          <button className="primary-button" type="submit" disabled={status === "loading"}>
            <CalendarPlus size={18} />
            {status === "loading" ? "Booking..." : "Confirm booking"}
          </button>
        </form>

        {accommodation ? (
          <article className="reservation-summary">
            <img src={accommodation.imageUrl} alt={`${type === "campsite" ? "Campsite" : "Cabin"} ${accommodation.identifier}`} />
            <div>
              <strong>{type === "campsite" ? "Campsite" : "Cabin"} {accommodation.identifier}</strong>
              <p>{accommodation.description}</p>
              <span>{accommodation.maxCapacity} guests</span>
              <span>${type === "campsite" ? accommodation.pricePerPerson : accommodation.pricePerDay} {type === "campsite" ? "per person" : "per day"}</span>
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
}
