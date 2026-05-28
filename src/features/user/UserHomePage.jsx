import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BedDouble, CalendarPlus, Tent, Waves } from "lucide-react";
import { useSelector } from "react-redux";
import { selectAuthUser } from "../auth/authSlice";
import { apiRequest } from "../../services/api";

export function UserHomePage() {
  const user = useSelector(selectAuthUser);
  const isAdmin = user?.role === "admin";
  const [cabins, setCabins] = useState([]);
  const [campsites, setCampsites] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    document: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    amountOfPeople: 1,
    accommodationId: ""
  });

  const accommodations = useMemo(
    () => [
      ...cabins.map((item) => ({ ...item, typeLabel: "Cabana", priceLabel: `$${item.pricePerDay} por dia` })),
      ...campsites.map((item) => ({ ...item, typeLabel: "Parcela", priceLabel: `$${item.pricePerPerson} por persona` }))
    ],
    [cabins, campsites]
  );

  useEffect(() => {
    async function loadUserHome() {
      try {
        const [cabinsData, campsitesData, bookingsData] = await Promise.all([
          apiRequest("/cabin"),
          apiRequest("/campsite"),
          apiRequest("/booking/mybookings")
        ]);

        setCabins(cabinsData.cabins || []);
        setCampsites(Array.isArray(campsitesData) ? campsitesData : []);
        setBookings(bookingsData.bookings || []);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    if (!isAdmin) {
      loadUserHome();
    }
  }, [isAdmin]);

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

      const bookingData = await apiRequest("/booking/create", {
        method: "POST",
        body: JSON.stringify({
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          amountOfPeople: form.amountOfPeople,
          accommodationId: form.accommodationId,
          guestId: guestData.newGuest.id
        })
      });

      setBookings((current) => [...current, bookingData.booking]);
      setForm({
        firstName: "",
        lastName: "",
        document: "",
        phone: "",
        checkIn: "",
        checkOut: "",
        amountOfPeople: 1,
        accommodationId: ""
      });
      setStatus("succeeded");
    } catch (requestError) {
      setError(requestError.message);
      setStatus("failed");
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>{isAdmin ? "Inicio administrador" : "Inicio usuario"}</h1>
          <p>{isAdmin ? "Acceso completo a la gestion del camping." : "Consulta alojamientos disponibles desde tu cuenta."}</p>
        </div>
      </div>

      <div className="quick-grid">
        {isAdmin ? (
          <Link className="quick-card" to="/app/dashboard">
            <Waves size={24} />
            <strong>Panel de gestion</strong>
            <span>Resumen general y accesos administrativos.</span>
          </Link>
        ) : null}
        <Link className="quick-card" to="/app/cabins">
          <BedDouble size={24} />
          <strong>Cabanas</strong>
          <span>Ver capacidad y precios por dia.</span>
        </Link>
        <Link className="quick-card" to="/app/campsites">
          <Tent size={24} />
          <strong>Parcelas</strong>
          <span>Ver capacidad y precios por persona.</span>
        </Link>
      </div>

      {!isAdmin ? (
        <div className="booking-home-grid">
          <form className="panel form compact-form" onSubmit={handleSubmit}>
            <h2>Hacer una reserva</h2>
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
              <input name="amountOfPeople" type="number" min="1" value={form.amountOfPeople} onChange={handleChange} required />
            </label>
            <label>
              Alojamiento
              <select name="accommodationId" value={form.accommodationId} onChange={handleChange} required>
                <option value="">Seleccionar</option>
                {accommodations.map((item) => (
                  <option key={`${item.typeLabel}-${item.id}`} value={item.id}>
                    {item.typeLabel} {item.identifier} - {item.priceLabel}
                  </option>
                ))}
              </select>
            </label>

            {error ? <p className="error">{error}</p> : null}

            <button className="primary-button" type="submit" disabled={status === "loading"}>
              <CalendarPlus size={18} />
              {status === "loading" ? "Reservando..." : "Reservar"}
            </button>
          </form>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Ingreso</th>
                  <th>Salida</th>
                  <th>Personas</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                    <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                    <td>{booking.amountOfPeople}</td>
                    <td>${booking.totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 ? <p className="state-text">Todavia no tenes reservas.</p> : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
