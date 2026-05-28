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
    phone: "",
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
      const guestData = await apiRequest("/guest/create", {
        method: "POST",
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          document: form.document,
          phone: form.phone
        })
      });

      await apiRequest("/booking/create", {
        method: "POST",
        body: JSON.stringify({
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          amountOfPeople: form.amountOfPeople,
          guestId: guestData.newGuest.id,
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
          <h1>Reservar {type === "campsite" ? "parcela" : "cabana"} {accommodation?.identifier}</h1>
          <p>Completá tus datos para confirmar la estadia.</p>
        </div>
      </div>

      <div className="booking-home-grid">
        <form className="panel form compact-form" onSubmit={handleSubmit}>
          <h2>Datos de reserva</h2>
          <label>
            Nombre
            <input name="firstName" value={form.firstName} onChange={handleChange} required />
          </label>
          <label>
            Apellido
            <input name="lastName" value={form.lastName} onChange={handleChange} required />
          </label>
          <label>
            Documento
            <input name="document" value={form.document} onChange={handleChange} required />
          </label>
          <label>
            Telefono
            <input name="phone" value={form.phone} onChange={handleChange} required />
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
            Personas
            <input name="amountOfPeople" type="number" min="1" max={accommodation?.maxCapacity} value={form.amountOfPeople} onChange={handleChange} required />
          </label>

          {error ? <p className="error">{error}</p> : null}

          <button className="primary-button" type="submit" disabled={status === "loading"}>
            <CalendarPlus size={18} />
            {status === "loading" ? "Reservando..." : "Confirmar reserva"}
          </button>
        </form>

        {accommodation ? (
          <article className="reservation-summary">
            <img src={accommodation.imageUrl} alt={`${type === "campsite" ? "Parcela" : "Cabana"} ${accommodation.identifier}`} />
            <div>
              <strong>{type === "campsite" ? "Parcela" : "Cabana"} {accommodation.identifier}</strong>
              <p>{accommodation.description}</p>
              <span>{accommodation.maxCapacity} personas</span>
              <span>${type === "campsite" ? accommodation.pricePerPerson : accommodation.pricePerDay} {type === "campsite" ? "por persona" : "por dia"}</span>
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
}
