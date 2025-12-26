
// src/components/Navbar.js
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import AuthModal from "./AuthModal";
import "./Navbar.css";

function Navbar({ setActivePanel, activePanel }) {
  const [showAuth, setShowAuth] = useState(false);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("USER");
  const [online, setOnline] = useState(false);

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  // Cart count from global cart
  const { cartCount } = useCart();

  useEffect(() => {
    const name = localStorage.getItem("name");
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (name && token) {
      setUserName(name);
      setRole(savedRole || "USER");
      setOnline(true);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-dark", "theme-light");
    root.classList.add(theme === "light" ? "theme-light" : "theme-dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const nav = document.querySelector(".fancy-nav");
    const onScroll = () => {
      if (window.scrollY > 20) nav?.classList.add("scrolled");
      else nav?.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    setUserName("");
    setRole("USER");
    setOnline(false);
    setActivePanel("welcome");
  };

  const openPanel = (panel) => setActivePanel(panel);
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <>
      <nav className="navbar fancy-nav glass-nav" role="navigation" aria-label="Main navigation">
        <div className="nav-left">
          <button className="logo-btn" onClick={() => openPanel("welcome")} aria-label="Go to home">
            <span className="logo-anim">🍽️</span>
            <span className="brand-text">MultiRestaurant</span>
          </button>
        </div>

        <div className="nav-center" role="menubar">
          <button className={`nav-btn nav-link ${activePanel === "about" ? "active-btn" : ""}`} onClick={() => openPanel("about")}>About <span className="moving-underline" /></button>
          {online && role === "ADMIN" && <>
            <button className={`nav-btn nav-link ${activePanel === "admin" ? "active-btn" : ""}`} onClick={() => openPanel("admin")}>Admin Panel</button>
            <button className={`nav-btn nav-link ${activePanel === "allOrders" ? "active-btn" : ""}`} onClick={() => openPanel("allOrders")}>All Hotel Orders</button>
          </>}
        </div>

        <div className="nav-right">
          <button className="icon-btn theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          {/* Cart button */}
          <button className="icon-btn cart-btn" onClick={() => openPanel("cart")} title="View Cart" aria-label={`Cart with ${cartCount} items`}>
            🛒 <span className="cart-count" aria-hidden="true">{cartCount}</span>
          </button>

          {!online ? (
            <button className="nav-btn small-btn primary ripple" onClick={() => setShowAuth(true)}>🔐 Sign in / Sign up</button>
          ) : (
            <>
              <span className="hello clickable" onClick={() => openPanel("profile")}>Hi, {userName} <span className="status online">(Online)</span></span>
              <button className="nav-btn danger ripple" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </nav>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} onSuccess={(name, userRole) => { setUserName(name); setRole(userRole || "USER"); setOnline(true); setShowAuth(false); }} />
    </>
  );
}

export default Navbar;









/*// src/components/Navbar.jsx
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import AuthModal from "./AuthModal";
import "./Navbar.css";

function Navbar({ setActivePanel, activePanel }) {
  const [showAuth, setShowAuth] = useState(false);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("USER");
  const [online, setOnline] = useState(false);

  // theme: 'dark' | 'light'
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  // Cart count from global cart
  const { cart } = useContext(CartContext);

  useEffect(() => {
    const name = localStorage.getItem("name");
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (name && token) {
      setUserName(name);
      setRole(savedRole || "USER");
      setOnline(true);
    }
  }, []);

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-dark", "theme-light");
    root.classList.add(theme === "light" ? "theme-light" : "theme-dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Sticky + shrink on scroll
  useEffect(() => {
    const nav = document.querySelector(".fancy-nav");
    const onScroll = () => {
      if (window.scrollY > 20) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");

    setUserName("");
    setRole("USER");
    setOnline(false);
    setActivePanel("welcome");
  };

  const openPanel = (panel) => {
    setActivePanel(panel);
  };

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <>
      <nav className="navbar fancy-nav glass-nav" role="navigation" aria-label="Main navigation">
        {/* LEFT: Logo / Home /}
        <div className="nav-left">
          <button
            className="logo-btn"
            onClick={() => openPanel("welcome")}
            aria-label="Go to home"
          >
            {/* Animated logo /}
            <span className="logo-anim">🍽️</span>
            <span className="brand-text">MultiRestaurant</span>
          </button>
        </div>

        {/* CENTER: nav links /}
        <div className="nav-center" role="menubar">
          <button
            className={`nav-btn nav-link ${activePanel === "about" ? "active-btn" : ""}`}
            onClick={() => openPanel("about")}
            role="menuitem"
          >
            About
            <span className="moving-underline" />
          </button>

          {online && role === "ADMIN" && (
            <>
              <button
                className={`nav-btn nav-link ${activePanel === "admin" ? "active-btn" : ""}`}
                onClick={() => openPanel("admin")}
                role="menuitem"
              >
                Admin Panel
                <span className="moving-underline" />
              </button>

              <button
                className={`nav-btn nav-link ${activePanel === "allOrders" ? "active-btn" : ""}`}
                onClick={() => openPanel("allOrders")}
                role="menuitem"
              >
                All Hotel Orders
                <span className="moving-underline" />
              </button>
            </>
          )}
        </div>

        {/* RIGHT: theme toggle + auth + cart /}
        <div className="nav-right">
          <button
            className="icon-btn theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            aria-pressed={theme === "light"}
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          {/* CART BUTTON /}
          <button
            className="icon-btn cart-btn"
            onClick={() => openPanel("cart")}
            title="View Cart"
            aria-label={`Cart with ${cart.length} items`}
          >
            🛒
            <span className="cart-count" aria-hidden="true">{cart.length}</span>
          </button>

          {!online ? (
            <button
              className="nav-btn small-btn primary ripple"
              onClick={() => setShowAuth(true)}
            >
              🔐 Sign in / Sign up
            </button>
          ) : (
            <>
              <span
                className="hello clickable"
                onClick={() => openPanel("profile")}
              >
                Hi, {userName} <span className="status online">(Online)</span>
              </span>

              <button className="nav-btn danger ripple" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* AUTH MODAL/}
      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={(name, userRole) => {
          setUserName(name);
          setRole(userRole || "USER");
          setOnline(true);
          setShowAuth(false);
        }}
      />
    </>
  );
}

export default Navbar;













/// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import AuthModal from "./AuthModal";
import "./Navbar.css";

function Navbar({ setActivePanel, activePanel }) {
  const [showAuth, setShowAuth] = useState(false);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("USER");
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("name");
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (name && token) {
      setUserName(name);
      setRole(savedRole || "USER");
      setOnline(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");

    setUserName("");
    setRole("USER");
    setOnline(false);
    setActivePanel("welcome");
  };

  const openPanel = (panel) => {
    setActivePanel(panel);
  };

  return (
    <>
      <nav className="navbar">
        {/* LEFT SECTION — HOME BUTTON /}
        <div className="nav-left">
          {activePanel !== "welcome" && (
            <button
              className="nav-btn home-btn"
              onClick={() => openPanel("welcome")}
            >
              🏠 Home
            </button>
          )}
        </div>

        {/* CENTER NAV ITEMS /}
        <div className="nav-center">
          <button className="nav-btn" onClick={() => openPanel("about")}>
            About
          </button>

          {/* ADMIN — ONLY FOR ADMINS /}
          {online && role === "ADMIN" && (
            <>
              <button className="nav-btn" onClick={() => openPanel("order")}>
                Order List
              </button>

              <button className="nav-btn" onClick={() => openPanel("admin")}>
                Admin Panel
              </button>

              <button className="nav-btn" onClick={() => openPanel("allOrders")}>
                All Hotel Orders
              </button>
            </>
          )}
        </div>

        {/* RIGHT SECTION — AUTH / PROFILE /}
        <div className="nav-right">
          {!online ? (
            <button
              className="nav-btn primary"
              onClick={() => setShowAuth(true)}
            >
              🔐 Sign in / Sign up
            </button>
          ) : (
            <>
              <span
                className="hello clickable"
                onClick={() => openPanel("profile")}
                style={{ cursor: "pointer" }}
              >
                Hi, {userName} <span className="status online">(Online)</span>
              </span>
              <button className="nav-btn danger" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* AUTH MODAL /}
      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={(name, userRole) => {
          setUserName(name);
          setRole(userRole || "USER");
          setOnline(true);
          setShowAuth(false);
        }}
      />
    </>
  );
}

export default Navbar;*/










/*// src/components/Navbar.jsx
import { useEffect, useState } from "react";
import AuthModal from "./AuthModal";
import "./Navbar.css";

function Navbar({ setActivePanel, activePanel }) {
  const [showAuth, setShowAuth] = useState(false);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("USER");
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("name");
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    if (name && token) {
      setUserName(name);
      setRole(savedRole || "USER");
      setOnline(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    setUserName("");
    setRole("USER");
    setOnline(false);
    setActivePanel("welcome");
  };

  const tryOpenPanel = (panel, adminOnly = false) => {
    if (adminOnly && role !== "ADMIN") {
      alert("Access denied — admin only.");
      return;
    }
    setActivePanel(panel);
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          {activePanel !== 'welcome' && (
            <button className="nav-btn home-btn" onClick={() => setActivePanel('welcome')}>🏠 Home</button>
          )}
        </div>

        <div className="nav-center">
          <button className="nav-btn" onClick={() => setActivePanel('about')}>About</button>

          {/* Order List: only admin sees it in your requirement /}
          <button className="nav-btn" onClick={() => tryOpenPanel('order', true)}>Order List</button>

          {/* Admin Panel: only admin /}
          <button className="nav-btn" onClick={() => tryOpenPanel('admin', true)} >Admin Panel</button>

          {/* All Hotel Orders: admin only /}
          <button className="nav-btn" onClick={() => tryOpenPanel('allOrders', true)}>All Hotel Orders</button>
        </div>

        <div className="nav-right">
          {!online ? (
            <button className="nav-btn primary" onClick={() => setShowAuth(true)}>🔐 Sign in / Sign up</button>
          ) : (
            <>
              <span className="hello clickable" onClick={() => setActivePanel('profile')} style={{cursor:"pointer"}}>
                Hi, {userName} <span className="status online">(Online)</span>
              </span>
              <button className="nav-btn danger" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </nav>

      <AuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={(name, userRole) => {
          setUserName(name);
          setRole(userRole || "USER");
          setOnline(true);
          setShowAuth(false);
        }}
      />
    </>
  );
}

export default Navbar;*/

















