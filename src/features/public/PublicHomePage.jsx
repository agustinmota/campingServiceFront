import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarSearch, LogIn, LogOut, UserPlus, Waves } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectAuthToken, selectAuthUser } from "../auth/authSlice";
import { apiRequest } from "../../services/api";

export function PublicHomePage() {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);
  const user = useSelector(selectAuthUser);
  const [accommodations, setAccommodations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [search, setSearch] = useState({ checkIn: "", checkOut: "", type: "all", amountOfPeople: 1 });

  useEffect(() => {
    async function loadAccommodations() {
      try {
        const [cabinsData, campsitesData] = await Promise.all([
          apiRequest("/cabin"),
          apiRequest("/campsite")
        ]);
        const cabins = (cabinsData.cabins || []).map((item) => ({ ...item, type: "cabin", typeLabel: "Cabana", price: item.pricePerDay, priceLabel: "por dia" }));
        const campsites = (Array.isArray(campsitesData) ? campsitesData : []).map((item) => ({ ...item, type: "campsite", typeLabel: "Parcela", price: item.pricePerPerson, priceLabel: "por persona" }));
        setAccommodations([...cabins, ...campsites]);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    loadAccommodations();
  }, []);

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await apiRequest("/booking/mybookings");
        setBookings(data.bookings || []);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    if (token) {
      loadBookings();
    } else {
      setBookings([]);
    }
  }, [token]);

  const handleDateChange = (event) => {
    setSearch((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const params = new URLSearchParams({
        checkIn: search.checkIn,
        checkOut: search.checkOut,
        amountOfPeople: search.amountOfPeople
      });
      const requests = [];

      if (search.type === "all" || search.type === "cabin") {
        requests.push(apiRequest(`/cabin/available?${params.toString()}`));
      }
      if (search.type === "all" || search.type === "campsite") {
        requests.push(apiRequest(`/campsite/available?${params.toString()}`));
      }

      const results = await Promise.all(requests);
      const cabins = (results.find((result) => result.cabins)?.cabins || []).map((item) => ({ ...item, type: "cabin", typeLabel: "Cabana", price: item.pricePerDay, priceLabel: "por dia" }));
      const campsites = (results.find((result) => result.campsites)?.campsites || []).map((item) => ({ ...item, type: "campsite", typeLabel: "Parcela", price: item.pricePerPerson, priceLabel: "por persona" }));
      setAccommodations([...cabins, ...campsites]);
      setStatus("succeeded");
    } catch (requestError) {
      setError(requestError.message);
      setStatus("failed");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <main className="public-page">
      <header className="public-nav">
        <div className="brand public-brand">
          <Waves size={28} />
          <strong>Camping Service</strong>
        </div>
        <nav>
          {token ? (
            <>
              <a className="secondary-button" href="#cabins">Cabanas</a>
              <a className="secondary-button" href="#my-bookings">Mis reservas</a>
              {user?.role === "admin" ? <Link className="secondary-button" to="/app/dashboard">Panel</Link> : null}
              <button className="primary-button" type="button" onClick={handleLogout}>
                <LogOut size={18} />
                Salir
              </button>
            </>
          ) : (
            <>
              <Link className="secondary-button" to="/register">
                <UserPlus size={18} />
                Crear usuario
              </Link>
              <Link className="primary-button" to="/login">
                <LogIn size={18} />
                Ingresar
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="public-hero">
        <div>
          <h1>Camping Service</h1>
          <p>Elegi una cabana, busca fechas libres y reserva con tu usuario.</p>
          <div className="hero-actions">
            {token ? (
              <a className="primary-button" href="#cabins">Ver cabanas</a>
            ) : (
              <>
                <Link className="primary-button" to="/login">
                  <LogIn size={18} />
                  Entrar
                </Link>
                <Link className="secondary-button" to="/register">
                  <UserPlus size={18} />
                  Crear usuario
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="public-cabins-section" id="cabins">
        <form className="availability-form" onSubmit={handleSearch}>
          <label>
            Check in
            <input name="checkIn" type="date" value={search.checkIn} onChange={handleDateChange} required />
          </label>
          <label>
            Check out
            <input name="checkOut" type="date" value={search.checkOut} onChange={handleDateChange} required />
          </label>
          <label>
            Tipo de alojamiento
            <select name="type" value={search.type} onChange={handleDateChange}>
              <option value="all">Todos</option>
              <option value="cabin">Cabanas</option>
              <option value="campsite">Parcelas</option>
            </select>
          </label>
          <label>
            Personas
            <input name="amountOfPeople" type="number" min="1" value={search.amountOfPeople} onChange={handleDateChange} required />
          </label>
          <button className="primary-button" type="submit" disabled={status === "loading"}>
            <CalendarSearch size={18} />
            {status === "loading" ? "Buscando..." : "Buscar disponibles"}
          </button>
        </form>

        {error ? <p className="error">{error}</p> : null}

        <div className="public-cabin-grid">
          {accommodations.map((accommodation) => (
            <Link className="public-cabin-card" to={`/app/reserve/${accommodation.type}/${accommodation.id}`} key={`${accommodation.type}-${accommodation.id}`}>
              <img src={accommodation.imageUrl} alt={`${accommodation.typeLabel} ${accommodation.identifier}`} />
              <div>
                <strong>{accommodation.typeLabel} {accommodation.identifier}</strong>
                <p>{accommodation.description}</p>
                <span>{accommodation.maxCapacity} personas</span>
                <span>${accommodation.price} {accommodation.priceLabel}</span>
              </div>
            </Link>
          ))}
        </div>

        {accommodations.length === 0 ? <p className="state-text">No hay alojamientos disponibles para esos filtros.</p> : null}
      </section>

      {token ? (
        <section className="public-cabins-section" id="my-bookings">
          <div className="page-header">
            <div>
              <h1>Mis reservas</h1>
              <p>Reservas hechas con tu usuario.</p>
            </div>
          </div>

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
        </section>
      ) : null}
    </main>
  );
}
