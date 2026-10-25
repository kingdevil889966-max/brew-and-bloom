import { useEffect, useState } from "react";
import axios from "axios";
import {
  Coffee,
  Menu,
  X,
  ArrowRight,
  Clock,
  MapPin,
  Mail,
  Phone,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "/api/bookings";

/* ---------- Illustrations ---------- */
const svgProps = {
  xmlns: "http://www.w3.org/2000/svg",
  preserveAspectRatio: "xMidYMid slice",
  "aria-hidden": "true",
  className: "art",
};

function HeroArt() {
  return (
    <svg viewBox="0 0 400 400" {...svgProps}>
      <defs>
        <radialGradient id="heroBg" cx="30%" cy="20%" r="90%">
          <stop offset="0" stopColor="#d9a066" />
          <stop offset="1" stopColor="#4a2e1d" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#heroBg)" />
      <ellipse cx="200" cy="300" rx="130" ry="26" fill="#f1e3d0" />
      <ellipse cx="200" cy="292" rx="105" ry="18" fill="#fffaf2" />
      <path d="M110 190h180v40c0 52-40 82-90 82s-90-30-90-82z" fill="#fffaf2" />
      <path
        d="M290 205h18c22 0 22 46 0 46h-24"
        fill="none"
        stroke="#fffaf2"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <ellipse cx="200" cy="190" rx="90" ry="16" fill="#6b3f26" />
      <ellipse cx="200" cy="190" rx="62" ry="9" fill="#9a6a45" />
      <g fill="none" stroke="#fffaf2" strokeOpacity=".7" strokeWidth="6" strokeLinecap="round">
        <path d="M165 150c-14-20 14-32 0-52" />
        <path d="M200 150c-14-20 14-32 0-52" />
        <path d="M235 150c-14-20 14-32 0-52" />
      </g>
    </svg>
  );
}

function CappuccinoArt() {
  return (
    <svg viewBox="0 0 300 210" {...svgProps}>
      <rect width="300" height="210" fill="#f1e8dc" />
      <ellipse cx="150" cy="165" rx="95" ry="18" fill="#e2d2bd" />
      <path d="M95 85h110v28c0 32-25 50-55 50s-55-18-55-50z" fill="#fffaf2" />
      <path d="M205 98h12c15 0 15 32 0 32h-16" fill="none" stroke="#fffaf2" strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="150" cy="85" rx="55" ry="10" fill="#8a5a3a" />
      <path d="M150 90c-18-10-14-20 0-14 14-6 18 4 0 14z" fill="#f3e3cc" />
    </svg>
  );
}

function CakeArt() {
  return (
    <svg viewBox="0 0 300 210" {...svgProps}>
      <rect width="300" height="210" fill="#f1e8dc" />
      <ellipse cx="150" cy="165" rx="105" ry="16" fill="#e2d2bd" />
      <path d="M70 90h160v60c0 8-10 14-20 14H90c-10 0-20-6-20-14z" fill="#5a3b28" />
      <rect x="70" y="112" width="160" height="10" fill="#f3e3cc" />
      <rect x="70" y="136" width="160" height="10" fill="#f3e3cc" />
      <path d="M70 90h160v10c-14 10-26-4-40 6s-26-4-40 6-26-4-40 6-26-4-40-6z" fill="#3a2418" />
      <circle cx="150" cy="78" r="10" fill="#b3261e" />
      <path d="M150 68c4-10 10-12 16-12" fill="none" stroke="#2e7d4f" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ColdCoffeeArt() {
  return (
    <svg viewBox="0 0 300 210" {...svgProps}>
      <rect width="300" height="210" fill="#f1e8dc" />
      <ellipse cx="150" cy="178" rx="60" ry="10" fill="#e2d2bd" />
      <path d="M105 60h90l-10 112c-1 6-6 8-12 8h-46c-6 0-11-2-12-8z" fill="#fffaf2" fillOpacity=".7" stroke="#d9c7b0" strokeWidth="3" />
      <path d="M110 105h80l-6 67c-1 5-5 8-11 8h-46c-6 0-10-3-11-8z" fill="#8a5a3a" />
      <path d="M108 85h84l-4 22h-76z" fill="#f3e3cc" />
      <rect x="125" y="72" width="22" height="22" rx="4" fill="#fffaf2" fillOpacity=".85" />
      <rect x="153" y="78" width="22" height="22" rx="4" fill="#fffaf2" fillOpacity=".85" />
      <path d="M170 20l-14 100" stroke="#b0733f" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Data ---------- */
const INITIAL_BOOKING = { name: "", email: "", date: "", time: "", guests: 2 };

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#menu", label: "Menu" },
  { href: "#booking", label: "Reservations" },
  { href: "#contact", label: "Contact" },
];

const PRODUCTS = [
  {
    name: "Cappuccino",
    price: "₹149",
    Art: CappuccinoArt,
    description: "Rich espresso topped with silky steamed milk foam.",
  },
  {
    name: "Chocolate Cake",
    price: "₹199",
    Art: CakeArt,
    description: "Moist, layered chocolate cake with a glossy ganache.",
  },
  {
    name: "Cold Coffee",
    price: "₹169",
    Art: ColdCoffeeArt,
    description: "Chilled, creamy and slow-brewed for a smooth finish.",
  },
];

const HIGHLIGHTS = [
  { value: "100%", label: "Freshly brewed" },
  { value: "Daily", label: "Baked in-house" },
  { value: "9 – 10", label: "Open every day" },
];

/* ---------- App ---------- */
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [booking, setBooking] = useState(INITIAL_BOOKING);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const updateField = (field) => (e) =>
    setBooking((prev) => ({ ...prev, [field]: e.target.value }));

  const handleBooking = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    setLoading(true);

    try {
      const response = await axios.post(API_URL, {
        ...booking,
        name: booking.name.trim(),
        email: booking.email.trim(),
        guests: Number(booking.guests),
      });

      setStatus({
        type: "success",
        text: response.data?.message || "Your reservation has been received.",
      });
      setBooking(INITIAL_BOOKING);
    } catch (error) {
      const reason = error.response
        ? `Server replied ${error.response.status}`
        : error.message;

      setStatus({
        type: "error",
        text:
          error.response?.data?.message ||
          `We couldn't complete your booking (${reason}).`,
      });
    } finally {
      setLoading(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="website">
      <header className={scrolled ? "navbar scrolled" : "navbar"}>
        <a className="brand" href="#home" onClick={closeMenu}>
          <Coffee size={26} aria-hidden="true" />
          <span>
            Brew <i>&amp; Bloom</i>
          </span>
        </a>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav
          id="primary-nav"
          className={menuOpen ? "nav-links open" : "nav-links"}
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}
          <a className="nav-cta" href="#booking" onClick={closeMenu}>
            Reserve a Table
          </a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">Specialty Coffee &amp; Bakery</span>
            <h1>
              Thoughtfully brewed.
              <br />
              Warmly <i>served.</i>
            </h1>
            <p>
              A calm, welcoming space for great coffee, fresh bakes and
              unhurried conversations.
            </p>
            <div className="hero-buttons">
              <a className="btn btn-primary" href="#menu">
                View Menu <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className="btn btn-outline" href="#booking">
                Reserve a Table
              </a>
            </div>
          </div>

          <div
            className="hero-image"
            role="img"
            aria-label="A cup of freshly brewed coffee"
          >
            <HeroArt />
            <div className="image-card">
              <span>Our philosophy</span>
              <strong>Every cup tells a story.</strong>
            </div>
          </div>
        </section>

        <section className="highlights" aria-label="Highlights">
          {HIGHLIGHTS.map((item) => (
            <div className="highlight" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </section>

        <section className="about section" id="about">
          <span className="eyebrow">About Us</span>
          <h2>
            Your cozy corner of the <i>city.</i>
          </h2>
          <p>
            We combine handcrafted coffee, freshly baked treats and a relaxed
            atmosphere to make every visit feel considered. Whether it's a
            quiet morning or a long catch-up, there's always a seat for you.
          </p>
        </section>

        <section className="menu-section section" id="menu">
          <span className="eyebrow">Our Menu</span>
          <h2>
            Signature <i>favourites</i>
          </h2>
          <p className="section-intro">
            A selection of what our guests love most.
          </p>

          <div className="product-grid">
            {PRODUCTS.map(({ name, price, description, Art }) => (
              <article className="product-card" key={name}>
                <div className="product-media">
                  <Art />
                </div>
                <div className="product-info">
                  <div className="product-title">
                    <h3>{name}</h3>
                    <strong>{price}</strong>
                  </div>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="booking section" id="booking">
          <div className="booking-intro">
            <span className="eyebrow">Reservations</span>
            <h2>
              Reserve your <i>table.</i>
            </h2>
            <p>
              Book ahead for a coffee date, a work session or a get-together
              with friends. We'll confirm your reservation by email.
            </p>
            <ul className="info-list">
              <li>
                <Clock size={18} aria-hidden="true" /> Open daily, 9:00 AM –
                10:00 PM
              </li>
              <li>
                <Users size={18} aria-hidden="true" /> Groups of up to 12
                guests
              </li>
            </ul>
          </div>

          <form className="booking-form" onSubmit={handleBooking}>
            <label>
              Full name
              <input
                type="text"
                required
                maxLength={80}
                autoComplete="name"
                value={booking.name}
                onChange={updateField("name")}
                placeholder="Your full name"
              />
            </label>

            <label>
              Email address
              <input
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                value={booking.email}
                onChange={updateField("email")}
                placeholder="you@example.com"
              />
            </label>

            <div className="form-row">
              <label>
                Date
                <input
                  type="date"
                  required
                  min={new Date().toLocaleDateString("en-CA")}
                  value={booking.date}
                  onChange={updateField("date")}
                />
              </label>

              <label>
                Time
                <input
                  type="time"
                  required
                  min="09:00"
                  max="21:59"
                  value={booking.time}
                  onChange={updateField("time")}
                />
              </label>
            </div>

            <label>
              Number of guests
              <select value={booking.guests} onChange={updateField("guests")}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="btn btn-primary btn-block"
              type="submit"
              disabled={loading}
            >
              {loading ? "Submitting…" : "Confirm Reservation"}
              {!loading && <ArrowRight size={18} aria-hidden="true" />}
            </button>

            <div
              className={`form-status ${status.type}`}
              role="status"
              aria-live="polite"
            >
              {status.text && (
                <>
                  {status.type === "success" ? (
                    <CheckCircle2 size={18} aria-hidden="true" />
                  ) : (
                    <AlertCircle size={18} aria-hidden="true" />
                  )}
                  <span>{status.text}</span>
                </>
              )}
            </div>
          </form>
        </section>

        <section className="contact section" id="contact">
          <span className="eyebrow">Contact</span>
          <h2>
            We'd love to <i>hear from you.</i>
          </h2>
          <p>Questions, events or feedback — our team is happy to help.</p>

          <div className="contact-grid">
            <a className="contact-card" href="mailto:hello@brewandbloom.example">
              <Mail size={22} aria-hidden="true" />
              <span>Email</span>
              <strong>hello@brewandbloom.example</strong>
            </a>
            <div className="contact-card">
              <Phone size={22} aria-hidden="true" />
              <span>Phone</span>
              <strong>+91 00000 00000</strong>
            </div>
            <div className="contact-card">
              <MapPin size={22} aria-hidden="true" />
              <span>Visit us</span>
              <strong>Your street address, City</strong>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="#home">
          <Coffee size={22} aria-hidden="true" />
          <span>
            Brew <i>&amp; Bloom</i>
          </span>
        </a>
        <p>© {new Date().getFullYear()} Brew &amp; Bloom. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;