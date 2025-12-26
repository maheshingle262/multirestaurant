// HotelOrderList.jsx
import { useEffect, useState } from "react";
import API from "../api";
import "./HotelOrderList.css";

function HotelOrderList({ hotelName }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingIds, setUpdatingIds] = useState(new Set());

  useEffect(() => {
    if (hotelName) fetchOrders();
  }, [hotelName]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(
        `/orders/hotel/${encodeURIComponent(hotelName)}`
      );

      const arr = Array.isArray(res.data) ? res.data : [];


      // ⭐ FIXED: hotelName normalization
      const normalized = arr.map((o) => ({
        id: o.id || "",
        customerName: o.customerName || "Unknown",
        customerEmail: o.customerEmail || "—",
        address: o.customerAddress || "—",
        contact: o.customerPhone || "—",
        foodName: o.foodName || "—",
        quantity: o.quantity || 1,
        price: o.price ?? 0,
        status: o.status || "Pending",
        orderDateTime: o.orderDateTime || null,

        // ⭐ NEW FIX: Always use valid hotel name
        hotelName:
          o.hotelName && o.hotelName.trim() !== ""
            ? o.hotelName
            : hotelName,
      }));

      normalized.sort((a, b) => {
        const da = a.orderDateTime ? new Date(a.orderDateTime) : 0;
        const db = b.orderDateTime ? new Date(b.orderDateTime) : 0;
        return db - da;
      });

      setOrders(normalized);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!orderId) return;

    const confirmPopup = window.confirm(
      `Do you want to change order status to "${newStatus}"?\n📩 Customer will get SMS instantly.`
    );
    if (!confirmPopup) return;

    setUpdatingIds((s) => new Set([...s, orderId]));

    try {
      await API.put(
        `/orders/update-status/${orderId}?status=${newStatus}`
      );

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      setTimeout(fetchOrders, 800);

      alert(`Status updated to ${newStatus}. SMS sent to customer.`);
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Status update failed. Try again.");
    } finally {
      setUpdatingIds((s) => {
        const copy = new Set(s);
        copy.delete(orderId);
        return copy;
      });
    }
  };

  const openDetails = (order) => setSelectedOrder(order);
  const closeDetails = () => setSelectedOrder(null);

  const formatDate = (d) => {
    if (!d) return "-";
    try {
      const dt = new Date(d);
      return isNaN(dt.getTime()) ? d : dt.toLocaleString();
    } catch {
      return d;
    }
  };

  return (
    <div className="hotelorderlist-wrapper">
      <div className="hotelorderlist-header">
        <h2>📜 Orders for {hotelName}</h2>

        <button className="btn refresh" onClick={fetchOrders} disabled={loading}>
          {loading ? "Loading..." : "🔄 Refresh"}
        </button>
      </div>

      {error && <p className="hotelorderlist-error">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className="hotelorderlist-empty">No orders found for this hotel.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="hotelorderlist-table-wrap">
          <table className="hotelorderlist-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Update</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o, i) => (
                <tr key={o.id} className={i % 2 === 0 ? "even" : "odd"}>
                  <td>{i + 1}</td>
                  <td className="order-id">{o.id}</td>

                  <td className="customer-col">
                    <div className="cust-name">{o.customerName}</div>
                    <div className="cust-email muted">{o.customerEmail}</div>
                  </td>

                  <td>
                    {o.foodName}
                    <div className="muted">Qty: {o.quantity}</div>
                  </td>

                  <td>₹{Number(o.price).toFixed(2)}</td>

                  <td>
                    <span className={`status-badge ${o.status.toLowerCase()}`}>
                      {o.status}
                    </span>
                  </td>

                  <td>{formatDate(o.orderDateTime)}</td>

                  <td className="actions-col">
                    <button className="btn details" onClick={() => openDetails(o)}>
                      Details
                    </button>

                    <select
                      className="status-select"
                      value={o.status}
                      disabled={updatingIds.has(o.id)}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Ready">Ready</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      className="btn quick-ready"
                      disabled={o.status === "Ready" || updatingIds.has(o.id)}
                      onClick={() => handleStatusChange(o.id, "Ready")}
                    >
                      ✅ Ready
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeDetails}>
              ✕
            </button>

            <h3>Order Details</h3>

            <p>
              <strong>Order ID:</strong> {selectedOrder.id}
            </p>

            <div className="modal-grid">
              <div>
                <strong>Customer:</strong>
                <p>{selectedOrder.customerName}</p>
                <p className="muted">{selectedOrder.customerEmail}</p>
                <p>📞 {selectedOrder.contact}</p>
                <p>📍 {selectedOrder.address}</p>
              </div>

              <div>
                <strong>Items:</strong>
                <p>{selectedOrder.foodName}</p>
                <p>Qty: {selectedOrder.quantity}</p>
                <p>
                  <strong>Total:</strong> ₹{selectedOrder.price}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status-badge ${selectedOrder.status.toLowerCase()}`}>
                    {selectedOrder.status}
                  </span>
                </p>

                <p>
                  <strong>Date:</strong> {formatDate(selectedOrder.orderDateTime)}
                </p>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn primary"
                onClick={() => {
                  handleStatusChange(selectedOrder.id, "Completed");
                  closeDetails();
                }}
              >
                Mark Completed
              </button>

              <button className="btn" onClick={closeDetails}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HotelOrderList;











/*// src/components/HotelOrderList.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import "./HotelOrderList.css";

function HotelOrderList({ hotelName }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingIds, setUpdatingIds] = useState(new Set());

  useEffect(() => {
    if (hotelName) fetchOrders();
    // eslint-disable-next-line
  }, [hotelName]);

  // Fetch Orders for this hotel
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(
        `http://localhost:8080/api/orders/hotel/${encodeURIComponent(hotelName)}`
      );
      const arr = Array.isArray(res.data) ? res.data : [];

      // Normalize fields for consistent usage on frontend
      const normalized = arr.map((o) => ({
        id: o.id || o._id || o.orderId || "",
        customerName:
          o.customerName || o.customerUsername || o.username || "Unknown",
        customerEmail: o.customerEmail || o.email || "—",
        address:
          o.customerAddress ||
          o.address ||
          o.deliveryAddress ||
          o.delivery_address ||
          "—",
        contact: o.customerPhone || o.contact || o.phone || "—",
        foodName:
          o.foodName ||
          (Array.isArray(o.items) ? o.items.join(", ") : o.items || "—"),
        quantity:
          o.quantity ||
          (Array.isArray(o.items) ? o.items.length : o.itemCount || 1),
        price: o.price ?? o.totalPrice ?? 0,
        status: o.status || "Pending",
        orderDateTime: o.orderDateTime || o.orderDate || o.date || null,
        hotelName: o.hotelName || hotelName || "—",
        raw: o,
      }));

      // sort newest first by date if present
      normalized.sort((a, b) => {
        const da = a.orderDateTime ? new Date(a.orderDateTime).getTime() : 0;
        const db = b.orderDateTime ? new Date(b.orderDateTime).getTime() : 0;
        return db - da;
      });

      setOrders(normalized);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update status API
  const handleStatusChange = async (orderId, newStatus) => {
    if (!orderId) return;
    setUpdatingIds((s) => new Set([...s, orderId]));
    try {
      await axios.put(
        `http://localhost:8080/api/orders/update-status/${encodeURIComponent(
          orderId
        )}?status=${encodeURIComponent(newStatus)}`
      );

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Status update failed. Try again.");
    } finally {
      setUpdatingIds((s) => {
        const copy = new Set(s);
        copy.delete(orderId);
        return copy;
      });
    }
  };

  const openDetails = (order) => setSelectedOrder(order);
  const closeDetails = () => setSelectedOrder(null);

  const formatDate = (d) => {
    if (!d) return "-";
    try {
      const dt = typeof d === "string" ? new Date(d) : new Date(d);
      if (isNaN(dt.getTime())) return d;
      return dt.toLocaleString();
    } catch {
      return d;
    }
  };

  return (
    <div className="hotelorderlist-wrapper">
      <div className="hotelorderlist-header">
        <h2>📜 Orders for {hotelName}</h2>
        <div className="hotelorderlist-controls">
          <button
            className="btn refresh"
            onClick={fetchOrders}
            disabled={loading}
            title="Refresh orders"
          >
            {loading ? "Loading..." : "🔄 Refresh"}
          </button>
        </div>
      </div>

      {error && <p className="hotelorderlist-error">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className="hotelorderlist-empty">No orders found for this hotel.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="hotelorderlist-table-wrap">
          <table className="hotelorderlist-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={o.id || i} className={i % 2 === 0 ? "even" : "odd"}>
                  <td>{i + 1}</td>
                  <td className="order-id">{o.id}</td>
                  <td className="customer-col">
                    <div className="cust-name">{o.customerName}</div>
                    <div className="cust-email muted">{o.customerEmail}</div>
                  </td>
                  <td className="items-col">
                    <div className="item-name">{o.foodName}</div>
                    <div className="item-qty muted">Qty: {o.quantity}</div>
                  </td>
                  <td>₹{Number(o.price).toFixed(2)}</td>
                  <td>
                    <span
                      className={`status-badge ${o.status?.toLowerCase() || "pending"}`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td>{formatDate(o.orderDateTime)}</td>
                  <td className="actions-col">
                    <button className="btn details" onClick={() => openDetails(o)}>
                      Details
                    </button>

                    <select
                      className="status-select"
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      disabled={updatingIds.has(o.id) || o.status === "Completed"}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Ready">Ready</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      className="btn quick-ready"
                      onClick={() => handleStatusChange(o.id, "Ready")}
                      disabled={o.status === "Ready" || updatingIds.has(o.id)}
                      title="Mark Ready"
                    >
                      ✅ Ready
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details modal /}
      {selectedOrder && (
        <div className="modal-overlay" onClick={closeDetails}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeDetails}>
              ✕
            </button>

            <h3>Order Details</h3>

            <div className="modal-section">
              <strong>Order ID:</strong> <span>{selectedOrder.id}</span>
            </div>

            <div className="modal-grid">
              <div className="modal-col">
                <strong>Customer</strong>
                <p>{selectedOrder.customerName}</p>
                <p className="muted">{selectedOrder.customerEmail}</p>
                <p>📞 {selectedOrder.contact}</p>
                <p>📍 {selectedOrder.address}</p>
              </div>

              <div className="modal-col">
                <strong>Hotel</strong>
                <p>{selectedOrder.hotelName}</p>

                <strong style={{ marginTop: 12 }}>Items</strong>
                <p>{selectedOrder.foodName}</p>
                <p>Qty: {selectedOrder.quantity}</p>
                <p>
                  <strong>Total:</strong> ₹{Number(selectedOrder.price).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="modal-section">
              <strong>Status:</strong>{" "}
              <span className={`status-badge ${selectedOrder.status?.toLowerCase()}`}>
                {selectedOrder.status}
              </span>
            </div>

            <div className="modal-section">
              <strong>Date:</strong> <span>{formatDate(selectedOrder.orderDateTime)}</span>
            </div>

            <div className="modal-actions">
              <button
                className="btn primary"
                onClick={() => {
                  handleStatusChange(selectedOrder.id, "Completed");
                  closeDetails();
                }}
              >
                Mark Completed
              </button>
              <button className="btn" onClick={closeDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HotelOrderList;*/









