import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarSearch, LogIn, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectAuthToken, selectAuthUser } from "../auth/authSlice";
import { apiRequest } from "../../services/api";
import { buildPublicAccommodations, mapPublicCabins, mapPublicCampsites } from "../../shared/accommodationUtils";
import { formatBookingStatus } from "../../shared/bookingStatus";
import { formatCurrency } from "../../shared/currencyUtils";
import { formatDate } from "../../shared/dateUtils";

export function PublicHomePage() {
  const dispatch = useDispatch();
  const roomsSectionRef = useRef(null);
  const token = useSelector(selectAuthToken);
  const user = useSelector(selectAuthUser);
  const [accommodations, setAccommodations] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isNavAtTop, setIsNavAtTop] = useState(true);
  const [isShowingAllAccommodations, setIsShowingAllAccommodations] = useState(false);
  const [search, setSearch] = useState({ checkIn: "", checkOut: "", type: "all", amountOfPeople: 1 });

  useEffect(() => {
    async function loadAccommodations() {
      try {
        const [cabinsData, campsitesData] = await Promise.all([
          apiRequest("/cabin"),
          apiRequest("/campsite")
        ]);
        setAccommodations(buildPublicAccommodations({
          cabins: cabinsData.cabins || [],
          campsites: Array.isArray(campsitesData) ? campsitesData : []
        }));
        setIsShowingAllAccommodations(false);
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

  useEffect(() => {
    const updateNavbarState = () => {
      setIsNavAtTop(window.scrollY < 24);
    };

    updateNavbarState();
    window.addEventListener("scroll", updateNavbarState, { passive: true });
    return () => window.removeEventListener("scroll", updateNavbarState);
  }, []);

  const visibleAccommodations = useMemo(
    () => (isShowingAllAccommodations ? accommodations : accommodations.slice(0, 5)),
    [accommodations, isShowingAllAccommodations]
  );

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
      const cabins = mapPublicCabins(results.find((result) => result.cabins)?.cabins || []);
      const campsites = mapPublicCampsites(results.find((result) => result.campsites)?.campsites || []);
      setAccommodations([...cabins, ...campsites]);
      setIsShowingAllAccommodations(false);
      setStatus("succeeded");
      window.requestAnimationFrame(() => {
        roomsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (requestError) {
      setError(requestError.message);
      setStatus("failed");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsMobileNavOpen(false);
  };

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
  };

  return (
    <main className="public-page">
      <header className={`public-nav ${isNavAtTop ? "at-top" : ""}`}>
        <a className="nav-logo-link" href="#hero" aria-label="Camping Service home">
          <img src="/img/HOTEL%20LOGO.png" alt="Camping Service logo" />
        </a>

        <nav className="public-nav-links">
          <a href="#about">About</a>
          <a href="#rooms">Accommodations</a>
          <a href="#amenities">Services</a>
          {token ? (
            <>
              <a href="#my-bookings">My bookings</a>
              {user?.role === "admin" ? <Link to="/app/dashboard">Dashboard</Link> : null}
              <button className="nav-action-link" type="button" onClick={handleLogout}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/register">Create user</Link>
              <Link className="public-nav-cta" to="/login">Book now</Link>
            </>
          )}
        </nav>

        <button className="mobile-menu-button" type="button" aria-label="Open menu" onClick={() => setIsMobileNavOpen(true)}>
          <Menu size={28} />
        </button>
      </header>

      <div className={`public-mobile-nav ${isMobileNavOpen ? "open" : ""}`}>
        <button className="mobile-close-button" type="button" aria-label="Close menu" onClick={closeMobileNav}>
          <X size={30} />
        </button>
        <a href="#about" onClick={closeMobileNav}>About</a>
        <a href="#rooms" onClick={closeMobileNav}>Accommodations</a>
        <a href="#amenities" onClick={closeMobileNav}>Services</a>
        <a href="#reserva" className="mobile-nav-cta" onClick={closeMobileNav}>Book now</a>
        {token ? (
          <>
            <a href="#my-bookings" onClick={closeMobileNav}>My bookings</a>
            {user?.role === "admin" ? <Link to="/app/dashboard" onClick={closeMobileNav}>Dashboard</Link> : null}
            <button type="button" onClick={handleLogout}>Sign out</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMobileNav}>Sign in</Link>
            <Link to="/register" onClick={closeMobileNav}>Create user</Link>
          </>
        )}
      </div>

      <section className="public-hero" id="hero">
        <div className="hero-content-shell">
          <div className="hero-heading">
            <p className="hero-eyebrow">Welcome to</p>
            <h1>Refugio<br />Del<br /><em>Lago.</em></h1>
            <p className="hero-tagline">Boutique campground - luxury nature stays</p>
          </div>

          <form className="availability-form hero-booking-form" onSubmit={handleSearch}>
            <label>
              Check in
              <input name="checkIn" type="date" value={search.checkIn} onChange={handleDateChange} required />
            </label>
            <label>
              Check out
              <input name="checkOut" type="date" value={search.checkOut} onChange={handleDateChange} required />
            </label>
            <label>
              Accommodation
              <select name="type" value={search.type} onChange={handleDateChange}>
                <option value="all">All</option>
                <option value="cabin">Cabins</option>
                <option value="campsite">Campsites</option>
              </select>
            </label>
            <label>
              Guests
              <input name="amountOfPeople" type="number" min="1" value={search.amountOfPeople} onChange={handleDateChange} required />
            </label>
            <button className="primary-button" type="submit" disabled={status === "loading"}>
              <CalendarSearch size={18} />
              {status === "loading" ? "Searching..." : "Check availability"}
            </button>
          </form>

          <div className="scroll-indicator">
            <span>Explore</span>
            <div />
          </div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="section-container about-grid">
          <div className="about-img-stack">
            <div className="about-img-main">
              <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=85" alt="Lake retreat spa" loading="lazy" />
            </div>
            <div className="about-img-accent">
              <img src="https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=700&q=85" alt="Warm cabin interior" loading="lazy" />
            </div>
            <div className="about-badge">
              <p>00</p>
              <span>Years of hospitality</span>
            </div>
          </div>

          <div className="about-text">
            <p className="section-eyebrow">About the Hotel</p>
            <h2 className="section-title section-title-light">Where the landscape<br />becomes <em>luxury</em></h2>
            <p>Refugio del Lago was created as a quiet place where nature, comfort, and thoughtful hospitality can live together without noise.</p>
            <p>Natural textures, lake views, cabins, campsites, and simple digital booking make each stay feel easy from the first click.</p>
            <div className="about-stats">
              <div><strong>{accommodations.length || "00"}</strong><span>Stays</span></div>
              <div><strong>4.9</strong><span>Average rating</span></div>
              <div><strong>All</strong><span>Lake calm</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="rooms-section" id="rooms" ref={roomsSectionRef}>
        <div className="section-container">
          <div className="rooms-header">
            <div>
              <p className="section-eyebrow">Accommodation</p>
              <h2 className="section-title">Cabins &<br />campsites by the lake</h2>
            </div>
            <p className="section-description">
              {status === "succeeded"
                ? `Showing ${accommodations.length} available ${accommodations.length === 1 ? "stay" : "stays"} for your dates.`
                : "Choose your stay, check the dates, and continue straight into the booking form."}
            </p>
          </div>

        {error ? <p className="error">{error}</p> : null}

        <div className="public-cabin-grid">
          {visibleAccommodations.map((accommodation) => (
            <Link className="public-cabin-card" to={`/app/reserve/${accommodation.type}/${accommodation.id}`} key={`${accommodation.type}-${accommodation.id}`}>
              <img src={accommodation.imageUrl} alt={`${accommodation.typeLabel} ${accommodation.identifier}`} />
              <div>
                <strong>{accommodation.typeLabel} {accommodation.identifier}</strong>
                <p>{accommodation.description}</p>
                <span>{accommodation.maxCapacity} guests</span>
                <span>{formatCurrency(accommodation.price)} {accommodation.priceLabel}</span>
              </div>
            </Link>
          ))}
        </div>

        {accommodations.length > 5 && !isShowingAllAccommodations ? (
          <div className="rooms-see-more">
            <button className="primary-button" type="button" onClick={() => setIsShowingAllAccommodations(true)}>
              See more
            </button>
          </div>
        ) : null}

        {accommodations.length === 0 ? <p className="state-text">No accommodations are available for those filters.</p> : null}
        </div>
      </section>

      <section className="amenities-section" id="amenities">
        <div className="section-container">
          <div className="amenities-header">
            <p className="section-eyebrow">Services</p>
            <h2 className="section-title">A complete outdoor experience</h2>
          </div>

          <div className="amenity-grid">
            <article className="amenity-item">
              <span>01</span>
              <strong>Spa & wellness</strong>
              <p>Quiet rituals, warm water, and slow mornings by the lake.</p>
            </article>
            <article className="amenity-item">
              <span>02</span>
              <strong>Lake views</strong>
              <p>Cabins and open-air areas connected to the surrounding landscape.</p>
            </article>
            <article className="amenity-item">
              <span>03</span>
              <strong>Breakfast</strong>
              <p>Local products served close to nature before the day begins.</p>
            </article>
            <article className="amenity-item">
              <span>04</span>
              <strong>Lake activities</strong>
              <p>Kayak, fishing, walks, and easy days near the water.</p>
            </article>
            <article className="amenity-item">
              <span>05</span>
              <strong>Outdoor dining</strong>
              <p>Simple seasonal food, firelight, and evenings under the trees.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="reservation-cta" id="reserva">
        <div>
          <p className="section-eyebrow">Bookings</p>
          <h2 className="section-title">Your next<br /><em>quiet moment</em></h2>
          <p className="section-description">Select a stay and complete your booking in minutes, fully online.</p>
          {token ? (
            <a className="primary-button" href="#rooms">Start booking</a>
          ) : (
            <Link className="primary-button" to="/login">
              <LogIn size={18} />
              Sign in to book
            </Link>
          )}
        </div>
      </section>

      {token ? (
        <section className="public-cabins-section my-bookings-section" id="my-bookings">
          <div className="page-header">
            <div>
              <h1>My bookings</h1>
              <p>Bookings made with your account.</p>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Guests</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{formatDate(booking.checkIn)}</td>
                    <td>{formatDate(booking.checkOut)}</td>
                    <td>{booking.amountOfPeople}</td>
                    <td>{formatCurrency(booking.totalAmount)}</td>
                    <td>
                      <span className={`booking-status-badge ${booking.status || "pending"}`}>
                        {formatBookingStatus(booking.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 ? <p className="state-text">You do not have any bookings yet.</p> : null}
          </div>
        </section>
      ) : null}

      <footer className="public-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="/img/HOTEL%20LOGO.png" alt="Camping Service logo" />
            <p>A luxury lakefront refuge where nature shapes every stay.</p>
            <small>Uruguay - Est. 2026</small>
          </div>

          <div className="footer-col">
            <h4>The hotel</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#rooms">Accommodations</a></li>
              <li><a href="#amenities">Services</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Information</h4>
            <ul>
              <li><a href="#reserva">Booking policies</a></li>
              <li><a href="#reserva">Check-in and check-out</a></li>
              <li><a href="#rooms">Available stays</a></li>
              <li><Link to="/register">Create account</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:info@refugiodellago.uy">info@refugiodellago.uy</a></li>
              <li><a href="tel:+59899999999">+598 99 999 999</a></li>
              <li><a href="#hero">Route 12 km 128, Uruguay</a></li>
              <li><a className="gold" href="#hero">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>(c) 2026 Refugio del Lago - All rights reserved</p>
          <div className="footer-socials">
            <a href="#hero">Instagram</a>
            <a href="#hero">WhatsApp</a>
            <a href="#rooms">Booking</a>
            <Link to="/login">Administration</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
