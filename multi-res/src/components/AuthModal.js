import { useState } from "react";
import API from "../api";
import "./AuthModal.css";

export default function AuthModal({ open, onClose, onSuccess }) {
  const [tab, setTab] = useState("USER"); // USER | SHOPKEEPER | ADMIN
  const [mode, setMode] = useState("login"); // login | register
  const [form, setForm] = useState({ username: "", email: "", password: "", secret: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const reset = () => {
    setForm({ username: "", email: "", password: "", secret: "" });
    setError("");
    setBusy(false);
    setMode("login");
  };

  const finish = (data, fallbackRole) => {
    const token = data?.token;
    const name = data?.name || data?.username || "";
    const role = data?.role || fallbackRole || "USER";
    if (!token) throw new Error("No token");
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    localStorage.setItem("role", role);
    onSuccess(name, role);
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      let res;
      const isShop = tab === "SHOPKEEPER";
      const isAdmin = tab === "ADMIN";

      if (mode === "login") {
        res = await API.post("/auth/login", { email: form.email, password: form.password });
      } else {
        if (isAdmin) {
          res = await API.post(
            "/auth/register-admin-bootstrap",
            { username: form.username, email: form.email, password: form.password },
            { headers: { "X-Admin-Secret": form.secret } }
          );
        } else if (isShop) {
          res = await API.post(
            "/auth/register-shopkeeper-bootstrap",
            { username: form.username, email: form.email, password: form.password },
            { headers: { "X-Shopkeeper-Secret": form.secret } }
          );
        } else {
          res = await API.post("/auth/register", { username: form.username, email: form.email, password: form.password });
        }
      }

      finish(res.data, tab);
      reset();
      onClose();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.response?.data || err?.message || "Network Error";
      setError(String(msg));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={() => { reset(); onClose(); }}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <div className="tab-bar">
          <div>
            <button className={tab === "USER" ? "active" : ""} onClick={() => { setTab("USER"); reset(); }}>User</button>
            <button className={tab === "SHOPKEEPER" ? "active" : ""} onClick={() => { setTab("SHOPKEEPER"); reset(); }}>ShopKeeper</button>
            <button className={tab === "ADMIN" ? "active" : ""} onClick={() => { setTab("ADMIN"); reset(); }}>Admin</button>
          </div>
          <button className="close" onClick={() => { reset(); onClose(); }}>✕</button>
        </div>

        <h3>{tab} {mode === "login" ? "Login" : "Register"}</h3>

        {error && <div className="error">{error}</div>}

        <form className="box" onSubmit={submit}>
          {mode === "register" && (
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" required />
          )}
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" required />
          <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" type="password" required />

          {(tab === "ADMIN" || tab === "SHOPKEEPER") && mode === "register" && (
            <>
              <input value={form.secret} onChange={(e) => setForm({ ...form, secret: e.target.value })} placeholder="Bootstrap secret (dev)" />
              <p className="auth-hint">Use correct secret to register this role.</p>
            </>
          )}

          <button type="submit" disabled={busy}>
            {busy ? "Please wait..." : (mode === "login" ? "Login" : "Sign Up")}
          </button>
        </form>

        <div className="switch-mode">
          {mode === "login"
            ? <p>No account? <button onClick={() => setMode("register")}>Create one</button></p>
            : <p>Already have an account? <button onClick={() => setMode("login")}>Login</button></p>}
        </div>
      </div>
    </div>
  );
}











/*// src/components/AuthModal.jsx
import { useState } from "react";
import API from "../api";
import "./AuthModal.css";

export default function AuthModal({ open, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState("USER"); // USER | ADMIN
  const [mode, setMode] = useState("login"); // login | register
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    adminSecret: ""
  });

  const [error, setError] = useState("");

  if (!open) return null;

  const clearForm = () => {
    setForm({ username: "", email: "", password: "", adminSecret: "" });
    setError("");
  };

  const finishLogin = (data, fallbackRole) => {
    const token = data?.token;
    const name = data?.name || data?.username || "";
    const role = data?.role || fallbackRole;

    if (!token) throw new Error("No token returned from server");

    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    localStorage.setItem("role", role);

    onSuccess(name, role);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      let res;
      const isAdmin = activeTab === "ADMIN";

      if (mode === "login") {
        res = await API.post("/api/auth/login", {
          email: form.email,
          password: form.password
        });
      } else {
        // register
        if (isAdmin) {
          if (!form.adminSecret) throw new Error("Admin secret is required");
          res = await API.post(
            "/api/auth/register-admin-bootstrap",
            {
              username: form.username,
              email: form.email,
              password: form.password
            },
            { headers: { "X-Admin-Secret": form.adminSecret } }
          );
        } else {
          res = await API.post("/api/auth/register", {
            username: form.username,
            email: form.email,
            password: form.password
          });
        }
      }

      finishLogin(res.data, isAdmin ? "ADMIN" : "USER");
      clearForm();
      setBusy(false);
      onClose();
    } catch (err) {
      console.error("Auth error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Something went wrong";

      // auto suggest signup if login failed
      if (mode === "login" && String(msg).toLowerCase().includes("not found")) {
        setError("Account not found. Please create one.");
        setMode("register");
      } else {
        setError(String(msg));
      }

      setBusy(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-card" onClick={(ev) => ev.stopPropagation()}>
        <div className="tab-bar">
          <div>
            <button
              className={activeTab === "USER" ? "active" : ""}
              onClick={() => {
                setActiveTab("USER");
                setMode("login");
                clearForm();
              }}
            >
              User
            </button>
            <button
              className={activeTab === "ADMIN" ? "active" : ""}
              onClick={() => {
                setActiveTab("ADMIN");
                setMode("login");
                clearForm();
              }}
            >
              Admin
            </button>
          </div>
          <button className="close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="panel">
          <h3>{activeTab} {mode === "login" ? "Login" : "Register"}</h3>
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit} className="box">
            {mode === "register" && (
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            {/* admin-only field /}
            {activeTab === "ADMIN" && mode === "register" && (
              <input
                type="text"
                placeholder="Admin Secret"
                value={form.adminSecret}
                onChange={(e) => setForm({ ...form, adminSecret: e.target.value })}
                required
              />
            )}

            <button type="submit" disabled={busy}>
              {busy ? "Please wait..." : mode === "login" ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="switch-mode">
            {mode === "login" ? (
              <p>
                No account?{" "}
                <button onClick={() => setMode("register")}>Create one</button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button onClick={() => setMode("login")}>Login</button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}








/*import { useState } from "react";
import API from "../api";
import "./AuthModal.css";

export default function AuthModal({ open, onClose, onSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const reset = () => {
    setUsername(""); setEmail(""); setPassword("");
    setError(""); setBusy(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError("");

    try {
      let res;
      if (mode === "register") {
        res = await API.post("/api/auth/register", { username, email, password });
      } else {
        res = await API.post("/api/auth/login", { email, password });
      }

      const { token, name } = res.data;
      if (!token) throw new Error("No token returned");
      localStorage.setItem("token", token);
      localStorage.setItem("name", name || username || "");
      onSuccess(name || username || "");
      reset();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <div className="auth-header">
          <button className={`tab ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>Login</button>
          <button className={`tab ${mode === "register" ? "active" : ""}`} onClick={() => setMode("register")}>Sign Up</button>
          <button className="close" onClick={onClose}>✕</button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {mode === "register" && (
            <div className="field">
              <label>Username</label>
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your name" />
            </div>
          )}

          <div className="field">
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          {error && <div className="error">{error}</div>}

          <button className="primary" type="submit" disabled={busy}>
            {busy ? "Please wait..." : (mode === "register" ? "Create account" : "Login")}
          </button>
        </form>
      </div>
    </div>
  );
}*/
