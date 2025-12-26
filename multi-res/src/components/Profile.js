import { useEffect, useState } from "react";
import API from "../api";
import "./Profile.css";

function Profile({ token: propToken }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showOrders, setShowOrders] = useState(false); // toggle button
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });

  const token = propToken || localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("⚠️ You are not logged in.");
      setLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    setLoading(true);
    setError("");

    // Fetch profile & orders
    const p1 = API.get("/user/profile", { headers });
    const p2 = API.get("/user/orders", { headers });

    Promise.all([p1, p2])
      .then(([resProfile, resOrders]) => {
        setUser(resProfile.data || null);
        setForm({
          username: resProfile.data.username || "",
          email: resProfile.data.email || "",
          password: "",
          address: resProfile.data.address || "",
          phone: resProfile.data.phone || "",
        });
        setOrders(Array.isArray(resOrders.data) ? resOrders.data : []);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        const msg =
          err?.response?.data?.error ||
          err?.response?.data ||
          err?.message ||
          "❌ Failed to fetch profile";
        setError(String(msg));
      })
      .finally(() => setLoading(false));
  }, [propToken, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await API.put("/user/profile", form, { headers });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      setUser(res.data);
      setEditMode(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Failed to update profile");
    }
  };

  const formatDate = (dt) => {
    if (!dt) return "";
    return new Date(dt).toLocaleString();
  };

  if (loading) return <p className="loading">⏳ Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!user) return <p>No user data found.</p>;

  return (
    <div className="profile-container">
      <h2>👤 User Profile</h2>

      {!editMode ? (
        <div className="profile-card">
          <p><b>Name:</b> {user.username}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>
          <p><b>Address:</b> {user.address || "—"}</p>
          <p><b>Phone:</b> {user.phone || "—"}</p>
          <button onClick={() => setEditMode(true)} className="btn-edit">✏️ Edit Profile</button>
        </div>
      ) : (
        <form className="profile-form" onSubmit={handleUpdate}>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New Password (leave blank to keep old)"
          />
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Delivery Address"
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
          />
          <div className="form-actions">
            <button type="submit" className="btn-save">💾 Save</button>
            <button type="button" className="btn-cancel" onClick={() => setEditMode(false)}>
              ❌ Cancel
            </button>
          </div>
        </form>
      )}

      {/* Past Orders Button */}
      <div className="orders-toggle">
        <button
          onClick={() => setShowOrders(!showOrders)}
          className="btn-orders"
        >
          {showOrders ? "⬆️ Hide Past Orders" : "📦 Show Past Orders"}
        </button>
      </div>

      {/* Orders Table */}
      {showOrders && (
        <div className="orders-section">
          <h3>📦 Your Past Orders</h3>
          {orders.length === 0 ? (
            <p>No past orders found.</p>
          ) : (
            <div className="orders-table-wrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Order ID</th>
                    <th>Items</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr key={order.id || order._id || idx}>
                      <td>{idx + 1}</td>
                      <td>{order.id || order._id || idx}</td>
                      <td>{order.foodName || order.items?.join(", ") || "—"}</td>
                      <td>{order.price ? `${order.price} ₹` : "—"}</td>
                      <td>
                        <span className={`status-badge ${order.status?.toLowerCase() || "pending"}`}>
                          {order.status || "—"}
                        </span>
                      </td>
                      <td>{formatDate(order.orderDateTime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;












/*import axios from "axios";   this code witout add botton for past order
import { useEffect, useState } from "react";
import "./Profile.css";

function Profile({ token: propToken }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });

  // Prefer propToken, otherwise fallback to localStorage
  const token = propToken || localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("⚠️ You are not logged in.");
      setLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    setLoading(true);
    setError("");

    // Fetch profile & orders
    const p1 = axios.get("http://localhost:8080/api/user/profile", { headers });
    const p2 = axios.get("http://localhost:8080/api/user/orders", { headers });

    Promise.all([p1, p2])
      .then(([resProfile, resOrders]) => {
        setUser(resProfile.data || null);
        setForm({
          username: resProfile.data.username || "",
          email: resProfile.data.email || "",
          password: "",
          address: resProfile.data.address || "",
          phone: resProfile.data.phone || "",
        });
        setOrders(Array.isArray(resOrders.data) ? resOrders.data : []);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        const msg =
          err?.response?.data?.error ||
          err?.response?.data ||
          err?.message ||
          "❌ Failed to fetch profile";
        setError(String(msg));
      })
      .finally(() => setLoading(false));
  }, [propToken, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.put("http://localhost:8080/api/user/profile", form, { headers });

      // If new token (email changed), save it
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      setUser(res.data);
      setEditMode(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Failed to update profile");
    }
  };

  const formatDate = (dt) => {
    if (!dt) return "";
    return new Date(dt).toLocaleString();
  };

  if (loading) return <p className="loading">⏳ Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!user) return <p>No user data found.</p>;

  return (
    <div className="profile-container">
      <h2>👤 User Profile</h2>

      {!editMode ? (
        <div className="profile-card">
          <p><b>Name:</b> {user.username}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>
          <p><b>Address:</b> {user.address || "—"}</p>
          <p><b>Phone:</b> {user.phone || "—"}</p>
          <button onClick={() => setEditMode(true)} className="btn-edit">✏️ Edit Profile</button>
        </div>
      ) : (
        <form className="profile-form" onSubmit={handleUpdate}>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New Password (leave blank to keep old)"
          />
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Delivery Address"
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
          />
          <div className="form-actions">
            <button type="submit" className="btn-save">💾 Save</button>
            <button type="button" className="btn-cancel" onClick={() => setEditMode(false)}>
              ❌ Cancel
            </button>
          </div>
        </form>
      )}

      <h3>📦 Your Past Orders</h3>
      {orders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order, idx) => (
            <div className="order-card" key={order.id || order._id || idx}>
              <p><b>Order ID:</b> {order.id || order._id || idx}</p>
              <p><b>Items:</b> {order.foodName || order.items?.join(", ") || "—"}</p>
              <p><b>Price:</b> {order.price ? `${order.price} ₹` : "—"}</p>
              <p><b>Date:</b> {formatDate(order.orderDateTime)}</p>
              <p><b>Status:</b> {order.status || "—"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;*/








/*// src/components/Profile.jsx    this code is withaout Add to cart system means users can see not see past orders and adit profile fun
import axios from "axios";
import { useEffect, useState } from "react";
//import "./Profile.css"; // new CSS file for styling

function Profile({ token: propToken }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Prefer propToken, otherwise fallback to localStorage
  const token = propToken || localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("⚠️ You are not logged in.");
      setLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    setLoading(true);
    setError("");

    // Fetch profile & orders in parallel
    const p1 = axios.get("http://localhost:8080/api/user/profile", { headers });
    const p2 = axios.get("http://localhost:8080/api/user/orders", { headers });

    Promise.all([p1, p2])
      .then(([resProfile, resOrders]) => {
        setUser(resProfile.data || null);
        setOrders(Array.isArray(resOrders.data) ? resOrders.data : []);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        const msg =
          err?.response?.data?.error ||
          err?.response?.data ||
          err?.message ||
          "❌ Failed to fetch profile";
        setError(String(msg));
      })
      .finally(() => setLoading(false));
  }, [propToken, token]);

  if (loading)
    return (
      <div className="profile-container">
        <p className="loading">⏳ Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="profile-container">
        <p className="error">{error}</p>
      </div>
    );

  if (!user)
    return (
      <div className="profile-container">
        <p>No user data found.</p>
      </div>
    );

  const formatDate = (dt) => {
    if (!dt) return "";
    return new Date(dt).toLocaleString();
  };

  return (
    <div className="profile-container">
      <h2>👤 User Profile</h2>
      <div className="profile-card">
        <p><b>Name:</b> {user.username}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Role:</b> {user.role}</p>
      </div>

      <h3>📦 Your Past Orders</h3>
      {orders.length === 0 ? (
        <p>No past orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order, idx) => (
            <div className="order-card" key={order.id || idx}>
              <p><b>Order ID:</b> {order.id || order._id || idx}</p>
              <p><b>Items:</b> {order.foodName || order.items?.join(", ") || "—"}</p>
              <p><b>Price:</b> {order.price ? `${order.price} ₹` : "—"}</p>
              <p><b>Date:</b> {formatDate(order.orderDateTime || order.orderDate || order.date)}</p>
              <p><b>Status:</b> {order.status || "—"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;*/













